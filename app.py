from flask import Flask, render_template, request, flash, jsonify, redirect,url_for
from flask_bootstrap import Bootstrap
from flask_login import LoginManager,login_user, logout_user, login_required, current_user

# models
"""
from werkzeug.security import generate_password_hash, check_password_hash

import datetime

from flask_login import UserMixin


from flask_sqlalchemy import SQLAlchemy
"""
# utilities
from forms import LoginForm, RegisterForm, DocumentForm
from models import *
import markdown
import json
import requests
import os
app = Flask(__name__)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = '.login'
Bootstrap(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///internal_portal.sqlite3'
app.config['SECRET_KEY']='12345678'





# VIEWS



@login_manager.user_loader
def load_user(id):
    return User.get_by_id(id)


# views
@app.route("/")
def home():
	return render_template("home.html",active='home',user=current_user)


@app.route("/register",methods=['GET','POST'])
def register():
	form = RegisterForm(request.form) 
	if request.method == 'POST' and form.validate():  
		
		user = User.create_element(form.name.data,form.password.data,form.email.data)
		#welcome_mail(user)
		flash("usuario creado")
		#print('Usuario '+str(user.id)+' Creado de forma exitosa')
		
		login_user(user)

		if current_user.is_authenticated:
			print("ya esta logged in")
			return redirect(url_for('.home'))

        
        
	print('Auth: '+str(current_user.is_authenticated))
	return render_template("register.html",title='Register', form=form, active='register',user=current_user)    

@app.route("/login",methods=['GET','POST'])
def login():
	# verificar si ya esta logueado

	form = LoginForm(request.form) 
	
	if request.method == 'POST' and form.validate(): 
		user = User.get_by_email(form.username.data)
		if user and user.verify_password(form.password.data):
			login_user(user)
			flash("user logged in")
			if current_user.is_authenticated:
				#return redirect(url_for('.tasks'))
				print("logged in")
				return redirect(url_for(".home"))
		else:
			flash("error",'error')
		#print("Nueva sesión creada con los valores: " + form.username.data +" "+ form.password.data + " resultado: "+str(current_user.is_authenticated))
	print('Auth: '+str(current_user.is_authenticated))
	
	return render_template("login.html",form=form)

@app.route("/logout")
def logout():
    print('Auth: '+str(current_user.is_authenticated))
    logout_user()
    print('Auth: '+str(current_user.is_authenticated))
    flash("Has cerrado sesión")

    return redirect(url_for('.login'))
#####################################################################################
# USERS
#####################################################################################
@app.route("/users",methods=['GET'])
@login_required
def users():
	
	users = db.engine.execute("select name,email,created_at from users;")
	column_names={
		"name":"Nombre",
		"email":"Correo electrónico",
		"created_at": "Fecha de creación"
	}
	return render_template("users.html",users = users,column_names=column_names,user=current_user)

#####################################################################################
# DOCUMENTS
#####################################################################################

@app.route("/documents",methods=['GET'])
@login_required
def documents():

	docs =db.engine.execute("select * from documents;")# Document.query.all()

	column_names={
		"id_document":"Código",
		"title":"Título",
		"lang": "Lenguaje",
		"path":"Directorio",
		"process":"Proceso"
	}
	return render_template("documents/documents.html",active="documents",docs=docs,column_names=column_names,user=current_user)

@app.route("/document/create",methods=['GET','POST'])
def create_document():
	form = DocumentForm(request.form)
	
	if request.method == 'POST':
		
		try:
			path = 'static/documents/{doc_no}.md'.format(doc_no=form.id_document.data)
			with open(path, 'w') as f:
				f.write(form.content.data)
			
			Document.create_element(form.id_document.data,form.title.data,"es",path,"Test Process")
		
		except Exception as ex:
			return jsonify({
				"error": str(ex)
			}), 500
		print(form.roles.data)

		return redirect(url_for('document',doc_no=form.id_document.data))

	roles=Role.query.all()
	print(roles)
	return render_template('/documents/create.html',form=form,roles=roles,user=current_user)

@app.route("/document/save/<doc_no>",methods=['POST'])
@login_required
def save_document(doc_no):
	content = request.get_json() # returns dict
	if not content: #js fix
		content = json.loads(request.get_data())
	
	if not 'markdown' in content:
		return jsonify({
			"Error": "no markdown specified"
		}), 400
	try:
		with open('static/documents/{doc_no}.md'.format(doc_no=doc_no), 'w') as f:
			f.write(content['markdown'])
	
	except Exception as ex:
		return jsonify({
			"error": ex
		}), 500
	return jsonify({
		"status":True,
		"path":'static/documents/{doc_no}.md'.format(doc_no=doc_no)
	})
@app.route("/document/delete/<doc_no>",methods=['GET','POST'])
@login_required
def delete_document(doc_no):
	if Document.delete_element(doc_no):
		os.remove(os.path.join(r"static/documents/", doc_no+".md"))
		flash("Documento {doc_no} eliminado".format(doc_no=doc_no))
		return redirect(url_for(".documents"))
	else:
		flash("El documento {doc_no} no existe".format(doc_no=doc_no))
		return redirect(url_for(".documents"))


@app.route("/document/edit/<doc_no>",methods=['GET','POST'])
@login_required
def edit_document(doc_no):
	if request.method == 'POST': #and form.validate():
		#print(request.form['markdown-code'])
		#from os import listdir
		#print(listdir())
		with open('static/documents/{doc_no}.md'.format(doc_no=doc_no), 'w') as f:
			f.write(request.form['markdown-code'])
		#return render_template("document.html",f=f,md=md,edit = edit,doc_no=doc_no)
		#redirect(url_for('.document')+"/"+doc_no)
		return redirect(url_for('document',doc_no=doc_no))
	else:
		try:
			f = app.open_resource('static/documents/{doc_no}.md'.format(doc_no=doc_no),mode='r').read()
			edit = True
		except FileNotFoundError:
			f="## El documento {doc_no} no se encuentra en este servidor".format(doc_no=doc_no)
			edit = False
		md = markdown.markdown(f)
		return render_template("documents/document.html",f=f,md=md,edit = edit,doc_no=doc_no,user=current_user)



@app.route("/render_markdown",methods=['POST'])
@login_required
def render_markdown():
	content = request.get_json() # returns dict
	if not content: #js fix
		content = json.loads(request.get_data())
	
	if not 'markdown' in content:
		return jsonify({
			"Error": "no markdown specified"
		}), 400
	return jsonify({
		"html": markdown.markdown(content['markdown'])
	})

@app.route("/document/<doc_no>",methods=['GET'])
@login_required
def document(doc_no):
	#f = url_for('static', filename='/documents/{doc_no}.md'.format(doc_no=doc_no))
	#f = open("/static/documents/{doc_no}.md".format(doc_no=doc_no), "r")
	try:
		f = app.open_resource('static/documents/{doc_no}.md'.format(doc_no=doc_no),mode='r').read()
	except FileNotFoundError:
		f="## El documento {doc_no} no se encuentra en este servidor".format(doc_no=doc_no)

	f = markdown.markdown(f)
	return render_template("documents/document.html",f=f,md = markdown,open = open,doc_no=doc_no,user=current_user)

# INIT APP


		# crear tablas
with app.app_context():
	#iniciar db en el app
	db.init_app(app)

	# crear tablas
	db.create_all()

if __name__ == '__main__':

	
	app.run(host="192.168.0.107", debug=True)