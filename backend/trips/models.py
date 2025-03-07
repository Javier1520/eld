from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

class Trip(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    current_location = models.CharField(max_length=255)
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    current_cycle_used = models.DecimalField(max_digits=5, decimal_places=2)  # Hours used
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Trip from {self.pickup_location} to {self.dropoff_location}"

class LogEntry(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="logs")
    date = models.DateField()
    total_miles = models.PositiveIntegerField()
    truck_number = models.CharField(max_length=50)
    carrier_name = models.CharField(max_length=255)
    main_office_address = models.CharField(max_length=255)
    driver_signature = models.CharField(max_length=255)
    co_driver_name = models.CharField(max_length=255, blank=True, null=True)
    time_base = models.CharField(max_length=50)
    remarks = models.JSONField(default=list, blank=True)
    total_hours = models.DecimalField(max_digits=4, decimal_places=2, default=0.0)
    shipping_document = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Log Entry {self.date} - {self.truck_number}"
