from flask import Flask, render_template, request, flash, jsonify, redirect,url_for, abort,send_file
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
import forms_setup
from models import *
import acl

import markdown
import json
import requests
import os
from miracle import Acl

app = Flask(__name__)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = '.login'
Bootstrap(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///internal_portal.sqlite3'
app.config['SECRET_KEY']='12345678'


def __react__():
	return render_template("index.html",react=react,reactDOM=reactDOM)

@app.errorhandler(403)
def page_not_found(error):
    return render_template('errors/403.html',user=current_user,acl = acl.acl),403 # retorna status 200 de exito



# VIEWS




@login_manager.user_loader
def load_user(id):
    return User.get_by_id(id)


# views
@app.route("/")
def home():
	return __react__()
	#return render_template("home.html",active='home',user=current_user,acl = acl.acl)

react = ""
reactDOM = ""

@app.route("/new/")
def home_new():
	return render_template("index.html",react=react,reactDOM=reactDOM)
@app.route("/login2")
def login2():
	return render_template("index.html",react=react,reactDOM=reactDOM)

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
	return render_template("register.html",title='Register', form=form, active='register',user=current_user,acl = acl.acl)    

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
	
	return render_template("login.html",form=form,acl = acl.acl)

@app.route("/logout")
def logout():
    print('Auth: '+str(current_user.is_authenticated))
    logout_user()
    print('Auth: '+str(current_user.is_authenticated))
    flash("Has cerrado sesión")

    return redirect(url_for('.login'))

#####################################################################################
# API
#####################################################################################

@app.route("/session/end",methods=["GET"])
def end_session():
	logout_user()
	if current_user.is_authenticated:
		return jsonify({
			"status":False,
			"exception":"something went wrong"
		})
	else: return jsonify({
		"status":True,
		"message":"user logged out"
	})

@app.route("/session/start",methods=['POST'])
def start_session():
	try:
		content = request.get_json() # returns dict
		if not content: #js fix
			content = json.loads(request.get_data())
		if content['username'] and content['password']:
			# data received properly
			user = User.get_by_email(content['username'])
			if user and user.verify_password(content['password']):
				login_user(user)
				if current_user.is_authenticated:
					return jsonify({
						"status": True,
						"username":content['username'],
						"password":content['password'],
						"message":f"User {content['username']} logged in"
					})
				else:
					return jsonify({
						"status": False,
						"exception":f"User {content['username']} not logged in"
					})
			else:
				# wrong user or password
				return jsonify({
					"status": False,
					"exception":f"User {content['username']} either doesn't exist or has wrong password"
				})
		else:
			return jsonify({
				"status": False,
				"exception":"Either username or password is missing"
			}),403
	except Exception as ex:
		return jsonify({
			"status": False,
			"exception": str(ex)
		})

@app.route("/session/",methods=['GET'])
def session():
	response ={
		"authenticated":current_user.is_authenticated,
	}
	if response['authenticated']:
		response["username"] = current_user.email
		response["role"] = current_user.role
		response["name"] = current_user.name
	return jsonify(response)

@app.route("/system/stats")
def system_stats():
	try:
		memory = os.popen("free -m").readlines()
	except Exception as ex:
		return jsonify({
			"status": False,
			"Exception": str(ex)
		}),403
	return jsonify({
		"status": True,
		"stats":{
			"memory": memory 
		}
		
	})
@app.route("/system/viewstats")
def view_system_stats():
	return __react__()


@app.route("/documents2")
def documents2():
	return __react__()

@app.route("/documents/get/")
@app.route("/documents/get/<document>")
def documents_get(document=False):
	
	if document:
		
		try:
			return jsonify({
						"status":True,
						"data": json.loads(Document.query.filter_by(id_document=document).first().data)
				})
		except Exception as ex:
			return jsonify({
				"status": False,
				"exception": str(ex)
			})

	else:
		res = db.engine.execute("select * from documents;")
		
		cnames =  [ cname[0] for cname in [c for c in res.cursor.description ]]
		res = [d for d in res]
		res2 =[list(tupl) for tupl in res]
		
		parsed = []
		
		for d in range(len(res2)):
			parsed_doc = {}
			for c in range(len(cnames)):
				try:
					parsed_doc[cnames[c]] =json.loads( res2[d][c])
				
				except:
					parsed_doc[cnames[c]] = res2[d][c]
				#print(f"column {c} {cnames[c]} data {d} {res2[d][c]}")
			#print("----------------------------")
			parsed.append(parsed_doc)

		return jsonify({
			"status": True,
			"parsed": parsed,
			"columns": cnames,
			#"documents" :(str([doc for doc in res]).replace("(","[").replace(")","]").replace("'",'"'))
			#"documents" :(str([doc for doc in res]))
			"documents": res2,
			
			#"parsed":[{[x]:arr2[x]} for x in [c for c in range(len(cnames))]] 
		})

@app.route("/documents/save",methods=['PUT'])
def document_save():
	try:
		content = request.get_json() # returns dict

		if not content: #js fix
			
			content = json.loads(request.get_data())
		
		#print(content['document_data'])
		#print(content['document_data'].__str__())
		
		if Document.get_by_id(content['document_code']):
			Document.update_element(
							content['document_code'],
							content['document_title'],
							content['document_lang'],
							data=json.dumps(content['document_data']))
			return jsonify({
				"status": True,
				"action": "updated",
				
			})
		
		
		Document.create_element(
			content['document_code'],
			content['document_title'],
			content['document_lang'],
			data=json.dumps(content['document_data']))
		
	except Exception as ex:
		return jsonify({
			"status": False,
			"Exception": str(ex)
		})
	content["status"] = True
	return jsonify(content)


@app.route("/links")
def links():
	return __react__()


@app.route("/recipents")
def recipents():
	return __react__()
@app.route("/recipents/get")
def get_recipents():

	return __react__()
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
	return render_template("users.html",users = users,column_names=column_names,user=current_user,acl = acl.acl)
#####################################################################################
# Roles
#####################################################################################

@app.route("/roles",methods=['GET'])
@login_required
def roles():
	if not acl.has_view_access("role",current_user):
		abort(403)
	return render_template("roles.html",active="Roles",user=current_user,acl = acl.acl)

@app.route("/roles/update",methods=['POST'])
def update_roles():
	try:
		content = request.get_json() # returns dict
		if not content: #js fix
			content = json.loads(request.get_data())
		if content['grant']:
			acl.acl.grant(content['role'],content['resource'],content['permission'])
		else:
			acl.acl.revoke(content['role'],content['resource'],content['permission'])
	except Exception as ex:
		return jsonify({
			"status": False,
			"exception":ex
		})
	return jsonify({
		"status": True,
		"access":{
			"role":content['role'],
			"resource":content['resource'],
			"permissions": list(acl.acl.which_permissions(content['role'],content['resource']))
		}
	})

#####################################################################################
# DOCUMENTS
#####################################################################################


@app.route("/documents",methods=['GET'])
@login_required
def documents():
	if not acl.has_view_access("document",current_user):
		abort(403)
	
	docs =db.engine.execute("select * from documents;")# Document.query.all()

	column_names={
		"id_document":"Código",
		"title":"Título",
		"lang": "Lenguaje",
		"path":"Directorio",
		"process":"Proceso"
	}
	return render_template("documents/documents.html",active="documents",docs=docs,column_names=column_names,user=current_user,acl = acl.acl)

@app.route("/document/create",methods=['GET','POST'])
def create_document():
	if not acl.has_view_access("document",current_user):
		abort(403)
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
	return render_template('/documents/create.html',form=form,roles=roles,active="documents",user=current_user,acl = acl.acl)

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
	if (not acl.acl.check_any(current_user.role.split(","),"document","update") or   acl.acl.check_any(current_user.role.split(","),"document","full_control") ):
		abort(403)
	if request.method == 'POST': #and form.validate():
		#print(request.form['markdown-code'])
		#from os import listdir
		#print(listdir())
		with open('static/documents/{doc_no}.md'.format(doc_no=doc_no), 'w') as f:
			f.write(request.form['markdown-code'])
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
		return render_template("documents/document.html",active="documents",f=f,md=md,edit = edit,doc_no=doc_no,user=current_user,acl = acl.acl)



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
	if not acl.has_view_access("document",current_user):
		abort(403)
	#f = url_for('static', filename='/documents/{doc_no}.md'.format(doc_no=doc_no))
	#f = open("/static/documents/{doc_no}.md".format(doc_no=doc_no), "r")
	try:
		f = app.open_resource('static/documents/{doc_no}.md'.format(doc_no=doc_no),mode='r').read()
	except FileNotFoundError:
		f="## El documento {doc_no} no se encuentra en este servidor".format(doc_no=doc_no)

	f = markdown.markdown(f)
	return render_template("documents/document.html",active="documents",f=f,md = markdown,open = open,doc_no=doc_no,user=current_user,acl = acl.acl)


#####################################################################################
# EMAILS
#####################################################################################
@app.route("/email/<email_address>/unsubscribe", methods=['GET'])
def unsubscribe(email_address):
	return redirect("https://zumamarkets.com")




#####################################################################################
# REDIRECTION LINKS
#####################################################################################
@app.route("/rl", methods=['GET'])
def rl():
	return redirect("https://zumamarkets.com")


@app.route("/rl/<redirect_name>", methods=['GET'])
def redirect_link(redirect_name):
	link = RedirectLink.get_redirect_link(redirect_name)
	if link:
		print(link)
		return redirect(link)	

	return redirect("https://zumamarkets.com")


@app.route("/rl/get/",methods=['GET'])
def get_all_rl():
	res = db.engine.execute("select * from redirect_links;")
	cnames =  [ cname[0] for cname in [c for c in res.cursor.description ]]
	
	res2 =[list(tupl) for tupl in [d for d in res]]
	print(res2)
	parsed = []
	for d in range(len(res2)):
		parsed_doc = {}
		for c in range(len(cnames)):
			parsed_doc[cnames[c]] = res2[d][c]
		parsed.append(parsed_doc)
	return jsonify({
		"status": True,
		"columns": cnames,
		"data": res2,
		"parsed": parsed
	})

#####################################################################################
# SETUP
#####################################################################################
@app.route("/setup",methods=['GET'])
@login_required
def setup():
	forms = [forms_setup.SMTPSetupForm(request.form)]
	settings = Setup.get_all_dict(['id_setup','value'])

	return render_template("setup.html",settings=settings,type=type,forms_setup =forms_setup, forms=forms,active="setup",user=current_user,acl = acl.acl)


@app.route("/setup/smtp",methods=['POST'])
def smtp_setup():
	form = forms_setup.SMTPSetupForm(request.form)
	if request.method == 'POST' and form.validate():
		for id_setup ,value in request.form.items():
			if not Setup.update_element(id_setup,value)	:
				flash("error")
			else:
				pass#flash("Configuraciones SMTP guardadas exitosamente")

	#return Setup.get
	return redirect(url_for('.setup'))

@app.route("/debug",methods=['GET'])
def debug():
	return str(Setup.get_all_dict(['id_setup','value']))

@app.route("/f/d/<path>",methods=['GET'])
def download_file(path):
	return send_file(path, as_attachment=True,)

# INIT APP
with app.app_context():
	#iniciar db en el app
	db.init_app(app)

	# crear tablas
	db.create_all()

react = "react.production.min.js"
reactDOM = "react-dom.production.min.js"

if __name__ == '__main__':
	react = "react.development.js"
	reactDOM = "react-dom.development.js"
	
	app.run(debug=True)