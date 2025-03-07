from django.contrib import admin
from .models import Trip, LogEntry

@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'pickup_location', 'dropoff_location', 'created_at')
    list_filter = ('user', 'created_at')
    search_fields = ('pickup_location', 'dropoff_location', 'current_location')

@admin.register(LogEntry)
class LogEntryAdmin(admin.ModelAdmin):
    list_display = ('id', 'trip', 'date', 'truck_number', 'total_miles', 'total_hours')
    list_filter = ('date', 'trip')
    search_fields = ('truck_number', 'carrier_name')
