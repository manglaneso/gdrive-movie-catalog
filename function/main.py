  import os
  import logging

  import requests

  from flask import jsonify


  def receive_notification(request):
      """Handle HTTP request sent by Google Drive API. Forwards the push notification to the Apps Script web app
      Args:
          request (flask.Request): HTTP request object.
      Returns:
          A JSON object stating the success of the handling or Unauthorized exception
      """

      try:
          id = request.headers['X-Goog-Channel-Id']

          if id == os.environ.get('WEBHOOK_ID'):
              request_json = request.get_json()
              logging.info(request_json)
              logging.info(request.headers)
              logging.info(request.json)

              url = os.environ.get('POST_URL')

              body = {'webhook_id': id}

              x = requests.post(url, data=body)

              logging.info(x.text)

              return jsonify(status='OK')
          else:
              raise Unauthorized('Not authorized to access this endpoint')
      except KeyError as e:
          raise Unauthorized('Not authorized to access this endpoint')




  def homepage(request):
      """Returns HTML page with Google verification token for the app's ownership to be verified by Google
      Args:
          request (flask.Request): HTTP request object.
      Returns:
          HTML page with the verification token as a meta argument
      """
      return '<html><head><meta name="google-site-verification" content="{verification_token}" /></head><body><h1>Hello world!</h1></body></html>'.format(verification_token=os.environ.get('GOOGLE_VERIFICATION_TOKEN'))

