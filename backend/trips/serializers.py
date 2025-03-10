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
        read_only_fields = ['total_hours']

    def validate_remarks(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Remarks must be a list")
        return value

    def validate(self, data):
        # Calculate total hours from remarks
        if 'remarks' in data:
            total_hours = 0.0
            for remark in data['remarks']:
                if 'hour_start' not in remark or 'hour_finish' not in remark:
                    raise serializers.ValidationError(
                        "Each remark must contain 'hour_start' and 'hour_finish'"
                    )

                try:
                    start = datetime.fromisoformat(remark['hour_start'])
                    finish = datetime.fromisoformat(remark['hour_finish'])

                    if finish <= start:
                        raise serializers.ValidationError(
                            "Finish time must be after start time"
                        )

                    total_hours += (finish - start).total_seconds() / 3600
                except (ValueError, TypeError):
                    raise serializers.ValidationError(
                        "Invalid datetime format. Use ISO format (YYYY-MM-DDTHH:MM:SS)"
                    )

            data['total_hours'] = round(total_hours, 2)

        return data