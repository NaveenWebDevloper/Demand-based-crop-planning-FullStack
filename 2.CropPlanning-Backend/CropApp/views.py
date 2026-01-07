from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
import pymysql

# ================= DATABASE CONNECTION =================
def get_db_connection():
    return pymysql.connect(
        host="127.0.0.1",
        user="root",
        password="root",
        database="webdb10",
        cursorclass=pymysql.cursors.DictCursor
    )

# ================= AUTO CREATE ADMIN =================
def ensure_single_admin():
    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("SELECT id FROM users1 WHERE role='admin'")
        admin = cur.fetchone()

        if not admin:
            cur.execute("""
                INSERT INTO users1
                (username,email,password,mobile,address,role,approved)
                VALUES (%s,%s,%s,%s,%s,%s,%s)
            """, (
                "admin",
                "admin@gmail.com",
                "admin",
                "1234567890",
                "Hyderabad",
                "admin",
                1
            ))
            con.commit()

# ================= REGISTER =================
@api_view(["POST"])
def register_api(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")
    confirm = request.data.get("confirm_password")
    mobile = request.data.get("mobile")
    address = request.data.get("address")

    if password != confirm:
        return Response({"error": "Passwords do not match"})

    if not all([username, email, password, mobile, address]):
        return Response({"error": "All fields are required"})

    con = get_db_connection()
    with con:
        cur = con.cursor()

        cur.execute("SELECT id FROM users1 WHERE username=%s", (username,))
        if cur.fetchone():
            return Response({"error": "Username already exists"})

        cur.execute("SELECT id FROM users1 WHERE email=%s", (email,))
        if cur.fetchone():
            return Response({"error": "Email already exists"})

        cur.execute("SELECT id FROM users1 WHERE mobile=%s", (mobile,))
        if cur.fetchone():
            return Response({"error": "Mobile already exists"})

        cur.execute("""
            INSERT INTO users1
            (username,email,password,mobile,address,role,approved)
            VALUES (%s,%s,%s,%s,%s,'user',0)
        """, (username, email, password, mobile, address))
        con.commit()

    return Response({"success": "Account created. Awaiting admin approval"})

# ================= LOGIN =================
@api_view(["POST"])
def login_api(request):
    ensure_single_admin()
    username = request.data.get("username")
    password = request.data.get("password")

    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("""
            SELECT * FROM users1
            WHERE username=%s AND password=%s
        """, (username, password))
        user = cur.fetchone()

    if not user:
        return Response({"error": "Invalid username or password"})

    if user["approved"] == 0:
        return Response({"error": "Account not approved by admin"})

    return Response({
        "success": "Login successful",
        "username": user["username"],
        "role": user["role"]
    })

# ================= USER DETAILS =================
@api_view(["GET"])
def user_details_api(request):
    username = request.GET.get("username")

    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("SELECT * FROM users1 WHERE username=%s", (username,))
        user = cur.fetchone()

    if not user:
        return Response({"error": "User not found"})

    return Response({"user": user})

# ================= ADMIN – VIEW USERS =================
@api_view(["GET"])
def admin_users_api(request):
    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("SELECT * FROM users1 WHERE role='user'")
        users = cur.fetchall()

    return Response({"users": users})

# ================= ADMIN – APPROVE USER =================
@api_view(["POST"])
def approve_user_api(request):
    username = request.data.get("username")

    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("UPDATE users1 SET approved=1 WHERE username=%s", (username,))
        con.commit()

    return Response({"success": "User approved successfully"})

# ======================================================
# ============== MARKET DEMAND APIs ====================
# ======================================================

# -------- ADD MARKET DEMAND --------
@api_view(["POST"])
def add_market_demand_api(request):
    crop = request.data.get("crop")
    region = request.data.get("region")
    season = request.data.get("season")
    quantity = request.data.get("quantity")
    price = request.data.get("price")

    if not all([crop, region, season, quantity, price]):
        return Response({"error": "All fields required"})

    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("""
            INSERT INTO market_demand
            (crop, region, season, quantity, price)
            VALUES (%s,%s,%s,%s,%s)
        """, (crop, region, season, quantity, price))
        con.commit()

    return Response({"success": "Market demand added"})

# -------- VIEW MARKET DEMAND --------
@api_view(["GET"])
def view_market_demand_api(request):
    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("SELECT * FROM market_demand")
        demand = cur.fetchall()

    return Response({"demand": demand})

# -------- UPDATE MARKET DEMAND (EDIT) --------
@api_view(["POST"])
def update_market_demand_api(request):
    demand_id = request.data.get("id")

    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("""
            UPDATE market_demand
            SET crop=%s, region=%s, season=%s, quantity=%s, price=%s
            WHERE id=%s
        """, (
            request.data["crop"],
            request.data["region"],
            request.data["season"],
            request.data["quantity"],
            request.data["price"],
            demand_id
        ))
        con.commit()

    return Response({"success": "Market demand updated"})
