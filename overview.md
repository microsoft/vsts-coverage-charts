## Quality Gate Widget ##

Widget to show the SonarQube Quality Gate status for a project

### Quick steps to get started ###

1. Edit your dashboard
2. Select the Quality Gate Widget

![](/static/images/Screen2.png)

3. Enter a title, a SonarQube project key and the URL for your SonarQube server

![](/static/images/Screen3.png)

4. Add and arrange one or more of the widgets on your dashboard.

### Known issue(s)

- You need to provide the full url for your SonarQube Api. 
Example: https://localhost/api/qualitygates/project_status?projectKey=
- SonarQube does not support HTTPS natively, so you need to setup a simple proxy for this. If you do not do this, then your browser will block any mixed protocol content you might want to serve.
- SonarQube does not provide CORS support natively, so you need to setup the response header for this. For VSTS the header could be: Access-Control-Allow-Origin = https://<your account>.visualstudio.com

### Learn More

The [source](https://github.com/yuriburger/quality-gate-widget) to this extension is available. Feel free to take, fork, and improve!

### Minimum supported environments ###

- Visual Studio Team Services

### Feedback ###
- Feedback welcome: add a review here or ....
- .... file any issues on GitHub [issues](https://github.com/yuriburger/quality-gate-widget/issues).