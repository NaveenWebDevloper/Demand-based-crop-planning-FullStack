from django.urls import path
from .views import *

urlpatterns = [
    path("register/", register_api),
    path("login/", login_api),

    path("userdetails/", user_details_api),

    # ADMIN
    path("admin/user/", admin_users_api),
    path("approve/", approve_user_api),

    # MARKET DEMAND
    path("add-market-demand/", add_market_demand_api),
    path("market-demand/", view_market_demand_api),
    path("update-market-demand/", update_market_demand_api),
]
