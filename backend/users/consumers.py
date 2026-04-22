import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # We use a group for 'all_donors' or specific 'user_{id}'
        self.user_id = self.scope['user'].id if self.scope['user'].is_authenticated else None
        
        # Always join a general broadcast group for emergencies
        await self.channel_layer.group_add(
            "emergency_broadcasts",
            self.channel_name
        )
        
        # If authenticated, join a personalized group
        if self.user_id:
            await self.channel_layer.group_add(
                f"user_{self.user_id}",
                self.channel_name
            )
            
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            "emergency_broadcasts",
            self.channel_name
        )
        if self.user_id:
            await self.channel_layer.group_discard(
                f"user_{self.user_id}",
                self.channel_name
            )

    async def receive(self, text_data):
        # Handle incoming messages if needed
        data = json.loads(text_data)
        pass

    async def send_notification(self, event):
        # Method called when a message is sent to the group
        message = event['message']
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'message': message
        }))
