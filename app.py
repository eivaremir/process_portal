from flask import Flask, render_template, request, flash, jsonify, redirect,url_for, abort,send_file
#from flask_bootstrap import Bootstrap
from flask_login import LoginManager,login_user, logout_user, login_required, current_user
from werkzeug.utils import secure_filename
import threading
import time
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
#Bootstrap(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///internal_portal.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SECRET_KEY']='12345678'
app.config['UPLOAD_FOLDER'] = "./assets"

def data_for_web(query):
	res = db.engine.execute(query)
	cnames =  [ cname[0] for cname in [c for c in res.cursor.description ]]
	res2 =[list(tupl) for tupl in [d for d in res]]
	parsed = []
	for e in range(len(res2)):
		parsed_item = {}
		for c in range(len(cnames)):
			parsed_item[cnames[c]] = res2[e][c]
		parsed.append(parsed_item)
	return jsonify({
		"status": True,
		"columns": cnames,
		"data": res2,
		"parsed": parsed
	})

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
	
	if False: pass
	else:
		res = db.engine.execute("select * from recipents;")
		
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
		response = jsonify({
			"status": True,
			"parsed": parsed,
			"columns": cnames,
			"data": res2,
		})
	return response
@app.route("/recipents/import",methods=['PUT'])
def import_recipents():
	try:
		content = request.get_json() # returns dict

		if not content: #js fix	
			content = json.loads(request.get_data())
		
		#print(content)
		
		# first split into new lines
		# split by commas
		# parse and reunite
		parsed_data = [ f'{y.__str__()[1:-1]}' for y in [x.split(",") for x in content['data'].split("\n")]]
		list_data = [ y for y in [x.split(",") for x in content['data'].split("\n")]]
		columns = parsed_data[0]
		
		
		

		existing_recipents = list(filter(lambda x : Recipent.get_by_address(x[0]) ,list_data[1:]))
		missing_recipents = list(filter(lambda x : not Recipent.get_by_address(x[0]) ,list_data[1:])	)
		
		#print(existing_recipents)
		#print(missing_recipents)
		query=""
		exceptions= []
		if len(existing_recipents)>0:
			# for each recipent ... theres update statement
			for recipent in existing_recipents:
				print(recipent)
				new = Recipent.get_by_address(recipent[0])
				print(new)
				c = 1
				for column in list_data[0][1:]:
					try:

						modification = f'new.{column} = "{recipent[c]}"'
						print(modification)
						exec(f'new.{column} = "{recipent[c]}"')
						print(eval(f'new.{column} '))
					except Exception as ex:
						exceptions.append(f'Failed to update {recipent[0]} on new.{column} = "{recipent[c]}" ')
					c+=1
					#new.name = "EIvar MOrales"
				db.session.add(new)
				db.session.commit()

		if len(missing_recipents)>0:	
			query += f"INSERT INTO RECIPENTS ({columns}) VALUES "
			


			for values in parsed_data[1:]: # parsed missing recipents
				query+= f"({values}),"
			
			query = query[:-1]+ ";"
			
		cursor = [db.engine.execute(q) for q in query.split(";")]
		
		resp = {
			"status": True,
			"data": parsed_data,
			"query":query,
			"columns": columns,
			"exceptions":exceptions
		}
	except Exception as ex:
		resp = {
			"status": False,
			"exception": str(ex),
			"exceptions":exceptions
			
		}
		try: resp["query"]:query
		except: pass

	#print(resp)
	return jsonify(resp)


@app.route("/tags")
def get_tags():
	res = db.engine.execute("SELECT tags from recipents; ");print(res)
	tags = [x for x in res];print(tags)
	r_tags =[]
	for g in [x.split("|") for x in [ y[0] for y in tags]]:
		r_tags+=g
	r_tags =list(filter(lambda tag: tag!='' ,list(dict.fromkeys(r_tags))))

	return jsonify({
		"status":True,
		"data": r_tags
	})
	

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

@app.route("/email/templates")
def template():
	return data_for_web("select * from email_templates;")

@app.route("/email/templates/save",methods=['PUT'])
def save_template():
	content = request.get_json()
	print(content)
	try:
		template = EmailTemplate.create_element(html=content['html'],subject=content['subject'])
		res={
			"status":True,
			"html":template.html,
			"subject":template.subject
		}
	except Exception as ex:
		res = {
			"status":False,
			"exception":str(ex)
		}

	return jsonify(res)

@app.route("/email/<email_address>/unsubscribe", methods=['GET'])
def unsubscribe(email_address):
	recipent = Recipent.unsubscribe(email_address)
	print("Unsubscribed: ",recipent)
	return redirect("https://zumamarkets.com")



@app.route("/email/save",methods=['PUT'])
def save_email():
	content = request.get_json() 
	try:
		email = Email.create_element(
			html=content['body'],
			subject=content['subject'],
			email_from_name=content['from_name'],
			email_from=content['from'],
			email_to=content['to']
		)
		response = {
			"status": True,
			"html":email.html,
			"subject":email.subject,
			"email_from_name":email.email_from_name,
			"email_from":email.email_from,
			"email_to":email.email_to
		}
	except Exception as ex:
		response:{
			"status":False,
			"exception":str(ex)
		}
	return jsonify(content)



def batch_send_emails():
	with app.app_context():

		pending_emails = [x for x in db.engine.execute("SELECT id_email_queued FROM email_queue where not email_sent and (status !='pause'or status is null);")]
		
		
		for email in pending_emails:
			eq = EmailQueue.query.filter_by(id_email_queued = email[0]).first() # verify again if the email hasnt been sent
			try:
				
				response = eq.ses_send()
				eq.response = json.dumps(response)
				eq.email_sent = 1
				db.session.add(eq)
				db.session.commit()
				print("Sent eq",email[0])
				time.sleep(0.01)
			except Exception as ex:
				db.session.rollback()
				eq.response = "Exception: "+str(ex)
				print("Exception with eq",email[0],str(ex))
				eq.email_sent = 0
				db.session.add(eq)
				db.session.commit()	


@app.route("/email/ses/get/send_quota")
def ses_get_send_quota():
	return jsonify(ses.get_send_quota())

@app.route("/email/get/")
def get_email():
	return data_for_web("select id_email,email_from_name,subject,html from emails;")

@app.route("/email/send",methods=["PUT"])
def send_email():
	content = request.get_json()

	try:
		# FOR A FUTURE SET THIS AS AN INTERNAL SAVE REQUEST
		email = Email.create_element(
			html=content['body'],
			subject=content['subject'],
			email_from_name="ZumaMarkets",#content['from_name'],
			email_from=content['from'],
			#email_to=content['to']
		)
		if content['byTag']:
			tags = str(content['tags'])[1:-1]
			
			cond = ""
			for tag in content['tags']:
				cond += f" instr(tags,'{tag}') or"
			cond = cond[:-2]
			q = ["SELECT address FROM RECIPENTS WHERE ("+cond+") AND SUBSCRIBED;"]
		else:
			expression = "('"+content['to'].split(",")[0]+"')" if len(content['to'].split(","))==1 else str(tuple(content['to'].split(",")))
			q = ["SELECT address FROM RECIPENTS WHERE address in "+expression+" AND subscribed;"]
			#print(q)
		res = db.engine.execute(q[0])
		recipents = [list(y) for y in [list(x) for x in res]]
		#print(recipents)
		# for each valid recipent, create item in queue
		for r in range(len(recipents)):
			recipents[r]={
				"id_recipent": recipents[r][0],
				"id_email": email.id_email # id just created
			}
		
		EmailQueue.add_emails(recipents)

		# start batch thread
		batch_send_emails_thread = threading.Thread(target=batch_send_emails)
		batch_send_emails_thread.start()

		response = {
			"query": q,
			"data": recipents
		}
		return jsonify(response)

	except Exception as ex:
		print(ex)
		response={
			"status":False,
			"exception":str(ex)
		}
	return jsonify(response)



@app.route("/email/", methods=['GET'])
def mail():
	return __react__()


#####################################################################################
# REDIRECTION LINKS
#####################################################################################
@app.route("/rl/", methods=['GET'])
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
	
	return data_for_web("select * from redirect_links;")

@app.route("/rl/save",methods=['PUT'])
def create_redirect_link():
	content = request.get_json()
	rl = RedirectLink.create_element(content['link_name'],content['redirect_to'])
	return jsonify({
		"status":True,
		"link_name":rl.link_name,
		"redirect_to":rl.redirect_to
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


@app.route("/affiliates",methods=['GET'])
def afiliados():
	#return render_template("afiliados.html")
	return redirect("https://partners.zumamarkets.com")


#####################################################################################
# UPLOADER
#####################################################################################

@app.route('/uploader/<key>', methods = ['GET', 'POST'])
def upload_file(key):
   if request.method == 'POST':
	   print(request.files)
	   print(dir(request.files))
	   f = request.files[key]
	   
	   print(secure_filename(f.filename))
	   fname = app.config['UPLOAD_FOLDER']+"/"+secure_filename(f.filename);print("subiendo",fname)
	   result = f.save(fname);print(result);print({
                   "success":1,
                   "file":{
                           #"url":"http://localhost"+port+"/"+fname[2:]
                           "url":assets_server+fname[1:]
                   }
           })
	   return jsonify({
		   "success":1,
		   "file":{
			   #"url":"http://localhost"+port+"/"+fname[2:]
			   "url":assets_server+fname[1:]
		   }
	   })

#####################################################################################
# WEBHOOK
#####################################################################################

@app.route('/webhooks/crm', methods = ['GET', 'POST'])
def crm_wh():
	handler = {
		"res":str(dir(request)),
		"method":request.method,
		"path":request.path,
		"query_string":str(request.query_string),
		"get_data":str(request.get_data()),
		
		"args":request.args
	}
	print(handler)
	return jsonify(handler)


# INIT APP
with app.app_context():
	#iniciar db en el app
	db.init_app(app)

	# crear tablas
	db.create_all()

react = "react.production.min.js"
reactDOM = "react-dom.production.min.js"
assets_server = ""
if __name__ == '__main__':
	react = "react.development.js"
	reactDOM = "react-dom.development.js"
	assets_server = "http://localhost"
	app.run(debug=True,port=5000)
