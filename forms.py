from wtforms import Form
from wtforms import validators #validaciones de formularios
from wtforms import StringField, PasswordField, BooleanField, HiddenField, TextAreaField
from wtforms.fields.html5 import EmailField

class LoginForm(Form):
    #campos con las respectivas validaciones
    username = StringField('Correo electrónico',[validators.length(max=50,message='El nombre de usuario debe ser menor a 50 caracteres')])
    password = PasswordField('Contraseña',[validators.Required()])

class RegisterForm(Form):
    #campos con las respectivas validaciones
    #honeypot = HiddenField("",[length_honeypot])
    email = EmailField('E-mail',[
        validators.Required(message='Debe proveer su correo electrónico'),
        validators.length(min=6,max=100),
        validators.Email(message='Ingrese un email válido')
    ])
    
    password = PasswordField('Password',[validators.Required(), validators.EqualTo('confirm_password', message='las contraseñas deben coincidir')])
    confirm_password = PasswordField('Confirm Password',[validators.Required()])
    accept = BooleanField('',[validators.DataRequired()])

class EditDocumentForm(Form):
    pass