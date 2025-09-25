import json
import os
import requests
from typing import Dict, Any, List

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Business: Send messages to OpenAI GPT models and get AI responses
    Args: event - dict with httpMethod, body, headers
          context - object with request_id, function_name attributes  
    Returns: HTTP response with AI generated content
    """
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, X-Model, X-Language',
                'Access-Control-Max-Age': '86400'
            },
            'body': '{}',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    # Get OpenAI API key from environment
    openai_api_key = os.environ.get('OPENAI_API_KEY')
    if not openai_api_key:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'OpenAI API key not configured. Please add OPENAI_API_KEY to project secrets.'
            }),
            'isBase64Encoded': False
        }
    
    # Parse request data
    body_str = event.get('body', '{}')
    try:
        body_data = json.loads(body_str)
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid JSON in request body'}),
            'isBase64Encoded': False
        }
    
    # Extract parameters
    messages: List[Dict[str, str]] = body_data.get('messages', [])
    model: str = body_data.get('model', 'gpt-3.5-turbo')
    language: str = body_data.get('language', 'ru')
    user_api_key: str = body_data.get('apiKey', '')
    
    if not messages:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Messages array is required'}),
            'isBase64Encoded': False
        }
    
    # Use user's API key if provided, otherwise use server key
    api_key_to_use = user_api_key if user_api_key else openai_api_key
    
    # Add system message for language preference
    language_prompts = {
        'ru': 'Отвечай на русском языке.',
        'en': 'Respond in English.',
        'es': 'Responde en español.',
        'pt': 'Responda em português.',
        'fr': 'Répondez en français.',
        'pt-BR': 'Responda em português brasileiro.'
    }
    
    system_message = {
        'role': 'system',
        'content': language_prompts.get(language, 'Отвечай на русском языке.')
    }
    
    # Prepare OpenAI request
    openai_messages = [system_message] + messages
    
    openai_payload = {
        'model': model,
        'messages': openai_messages,
        'max_tokens': 2000,
        'temperature': 0.7,
        'stream': False
    }
    
    headers = {
        'Authorization': f'Bearer {api_key_to_use}',
        'Content-Type': 'application/json'
    }
    
    try:
        # Make request to OpenAI API
        response = requests.post(
            'https://api.openai.com/v1/chat/completions',
            json=openai_payload,
            headers=headers,
            timeout=60
        )
        
        if response.status_code != 200:
            error_text = response.text
            try:
                error_json = response.json()
                error_message = error_json.get('error', {}).get('message', f'OpenAI API error: {response.status_code}')
            except:
                error_message = f'OpenAI API error: {response.status_code} - {error_text}'
                
            return {
                'statusCode': response.status_code,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': error_message}),
                'isBase64Encoded': False
            }
        
        openai_response = response.json()
        
        # Extract the AI response
        if 'choices' not in openai_response or not openai_response['choices']:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'No response from OpenAI'}),
                'isBase64Encoded': False
            }
        
        ai_message = openai_response['choices'][0]['message']
        usage_info = openai_response.get('usage', {})
        
        result = {
            'message': ai_message,
            'model': model,
            'usage': usage_info,
            'timestamp': context.request_id
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(result),
            'isBase64Encoded': False
        }
        
    except requests.RequestException as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Request failed: {str(e)}'}),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Unexpected error: {str(e)}'}),
            'isBase64Encoded': False
        }