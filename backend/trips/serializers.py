from rest_framework import serializers
from .models import Trip, LogEntry
from datetime import datetime

class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = '__all__'
        read_only_fields = ['user']

    def create(self, validated_data):
        # Automatically set the user to the authenticated user from the request
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class LogEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LogEntry
        fields = '__all__'

    def validate_remarks(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Remarks must be a list")
        return value
