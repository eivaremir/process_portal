from wtforms import Form
from wtforms import validators #validaciones de formularios
from wtforms import StringField, PasswordField,IntegerField#, BooleanField, HiddenField, TextAreaField, SelectMultipleField
from wtforms.fields.html5 import EmailField

class SMTPSetupForm(Form):
    email_from = EmailField('Enviar desde',[
        validators.Required(message='Debe proveer su correo electrónico'),
        validators.length(min=6,max=100),
        validators.Email(message='Ingrese un email válido')
    ])
    smtp_server = StringField('Servidor SMTP',[
        validators.length(max=50,message='El nombre de usuario debe ser menor a 50 caracteres'),
        validators.Required()
    ])
    email_from_password = PasswordField('Contraseña',[validators.Required()])
    smtp_port = IntegerField("Puerto SMTP")