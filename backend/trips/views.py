from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Trip, LogEntry
from .serializers import TripSerializer, LogEntrySerializer

# Create your views here.

class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filter trips by the authenticated user
        return Trip.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Set the user automatically to the authenticated user
        serializer.save(user=self.request.user)

class LogEntryViewSet(viewsets.ModelViewSet):
    queryset = LogEntry.objects.all()
    serializer_class = LogEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filter log entries by the authenticated user's trips
        return LogEntry.objects.filter(trip__user=self.request.user)
