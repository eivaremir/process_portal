from werkzeug.security import generate_password_hash, check_password_hash
import datetime
from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy

##########################################
# EMAIL
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import boto3
from botocore.config import Config
from credentials import credentials
##########################################
import re

db =SQLAlchemy()

ses = boto3.client(
    'ses',
    aws_access_key_id=credentials['aws_access_key_id'],
    aws_secret_access_key=credentials['aws_secret_access_key'],
    config=Config(region_name="us-west-2")
)
class Utils():
    
    @classmethod
    def parse_variables(cls,content,recipent_address):
        rgx = re.compile("__[^\s]*?__")
        recipent = Recipent.query.filter_by(address=recipent_address).first()
        # {**dict1, **dict2} # merge 2 dicts
        if recipent:
            variables = {
                "address":recipent.address,
                "subscribed":recipent.subscribed
            }
            while rgx.search(content):
                try:
                    content = content.replace(rgx.search(content)[0],str(variables[rgx.search(content)[0][2:-2]]))
                # if the variable doesnt exists
                except KeyError:
                    content = content.replace(rgx.search(content)[0],"")
                
        return content

class Setup(db.Model):
    __tablename__ = 'setup'
    id_setup = db.Column(db.String(30),primary_key=True)
    value= db.Column(db.String(30),nullable=False)
    description = db.Column(db.String(100),nullable=False)
    @classmethod
    def get_all_dict(cls, fields =[]):
        return dict((x, y) for x, y in [x for x in (db.engine.execute("select * from Setup;") if fields ==[] else db.engine.execute("select {fields} from Setup;".format(fields= str(fields).replace("]","").replace("[","").replace("'","")))) ]) 



    
    @classmethod
    def get_by_id(cls, id):
        # busca la línea en la bd
        return Setup.query.filter_by(id_setup=id).first()

    @classmethod
    def update_element(cls, id,value):
        
        # busca la línea task en la base de datos segun la información de la vista
        setup = Setup.get_by_id(id)

        # si ese objeto no existe...
        if setup is None:
            return False
        
        # si el objeto existe... modifica la línea con la información de la vista
        setup.value=value

        # aplica los cambios en la bd
        db.session.add(setup)
        db.session.commit()
        
        return setup

class Role(db.Model):
    __tablename__ = 'roles'
    id_role = db.Column(db.Integer,primary_key=True)
    name =  db.Column(db.String(30),nullable=False)
    description = db.Column(db.String(200),nullable=False)


class EmailQueue(db.Model):
    __tablename__ = 'email_queue'
    id_email_queued = db.Column(db.Integer,primary_key=True)
    id_recipent = db.Column(db.String(), db.ForeignKey('recipents.address'))
    id_email =  db.Column(db.Integer, db.ForeignKey('emails.id_email'))
    email_sent = db.Column(db.Boolean(),nullable=False)
    response = db.Column(db.String(),nullable=False)

    @classmethod
    def add_emails(cls,emails):
        queue = []
        print("preparing emails")
        for email in emails:
            
            
            queue.append(EmailQueue(
                id_recipent= email['id_recipent'],
                id_email=email['id_email'],
                email_sent=0,
                response="")
            )
            ##print("queue",queue)
        #print(queue[0])
        #print(type(queue[0]))
        print("adding to db")
        db.session.add_all(queue)
        db.session.commit()

    def ses_send(self):
        
        email = Email.query.filter_by(id_email=self.id_email).first()
        #recipent = Recipent.query.filter_by(address =id_recipent).first()
        response = ses.send_email(
            Source = f"{email.email_from_name} <{email.email_from}>",
            
            Destination = {
                'ToAddresses': [self.id_recipent]
            },
            Message = {
                "Subject":{
                    'Data': email.subject,
                    'Charset': 'latin1'
                },
                "Body":{
                    'Html':{
                        'Data':Utils.parse_variables(email.html,self.id_recipent),
                        'Charset': 'utf-8'
                    }
                }
            }


        )
        return response

class Email(db.Model):
    __tablename__ = 'emails'
    id_email = db.Column(db.Integer,primary_key=True)
    html = db.Column(db.String(),nullable=False)
    subject = db.Column(db.String(255),nullable=False)
    email_from_name = db.Column(db.String(30),nullable=False)
    email_from = db.Column(db.String(30),nullable=False)
    #email_to = db.Column(db.String(30),nullable=False)
     
    @classmethod
    def compute_recipents(cls,recipents):
        return recipents(",")
    
    def ses_send(self):
        try:
            response = ses.send_email(
                Source = f"{self.email_from_name} <{self.email_from}>",
                
                Destination = {
                    'ToAddresses': self.compute_recipents()
                },
                Message = {
                    "Subject":{
                        'Data': self.subject,
                        'Charset': 'latin1'
                    },
                    "Body":{
                        'Html':{
                            'Data':self.html,
                            'Charset': 'utf-8'
                        }
                    }
                }


            )
        except Exception as ex:
            response = str(ex)
        
        return response


    @classmethod
    def create_element(cls,html,subject,email_from_name="",email_from=""):
        email = Email(html=html,subject=subject,email_from_name=email_from_name,email_from=email_from)
        
        # registrar nueva entrada en la BD
        db.session.add(email)

        # registramos acciones
        db.session.commit()
        return email


    def send(self,to,s):
        self.msg = MIMEMultipart('alternative')
        self.msg['Subject'] = self.subject
        self.msg['From'] = self.email_from
        self.msg['To'] = to
        self.msg.attach(MIMEText(self.html, 'html'))


class EmailTemplate(db.Model):
    __tablename__ = 'email_templates'
    id_template = db.Column(db.Integer,primary_key=True)
    html = db.Column(db.String(),nullable=False)
    subject = db.Column(db.String(255),nullable=False)
    @classmethod
    def create_element(cls,html,subject):
        email = EmailTemplate(html=html,subject=subject)
        
        # registrar nueva entrada en la BD
        db.session.add(email)

        # registramos acciones
        db.session.commit()
        
        return email

class RedirectLink(db.Model):
    __tablename__ = 'redirect_links'
    link_name = db.Column(db.String(),primary_key=True) 
    redirect_to = db.Column(db.String(),nullable=False) 
    @classmethod
    def get_by_name(cls, link_name):
        # busca la línea en la bd
        return  RedirectLink.query.filter_by(link_name=link_name).first()
    
    @classmethod
    def get_redirect_link(cls,name):
        redirect = RedirectLink.get_by_name(name)

        # si ese objeto no existe...
        if redirect is None:
            return False
        
        return redirect.redirect_to
    @classmethod
    def create_element(cls,link_name,redirect_to):
        rl = RedirectLink(link_name=link_name,redirect_to=redirect_to)
        
        # registrar nueva entrada en la BD
        db.session.add(rl)

        # registramos acciones
        db.session.commit()
        
        return rl

class Recipent(db.Model):
    __tablename__ = 'recipents'
    address = db.Column(db.String(),primary_key=True) 
    subscribed  = db.Column(db.Boolean(),nullable=False)
    tags = db.Column(db.String(),nullable=False)
    @classmethod
    def get_by_address(cls, address):
        # busca la línea en la bd
        return Recipent.query.filter_by(address=address).first()

    @classmethod
    def unsubscribe(cls,address):
        # busca la línea task en la base de datos segun la información de la vista
        recipent = Recipent.get_by_address(address)

        # si ese objeto no existe...
        if recipent is None:
            return False
        
        # si el objeto existe... modifica la línea con la información de la vista
        recipent.subscribed = False
        

        # aplica los cambios en la bd
        db.session.add(recipent)
        db.session.commit()
        
        return recipent

 
class Document(db.Model):

    __tablename__ = 'documents'
    id_document = db.Column(db.String(50),primary_key=True)
    title =db.Column(db.String(100),nullable=False)
    lang = db.Column(db.String(2),nullable=False) #ISO 639-1 
    path =db.Column(db.String(200),nullable=False)
    process =db.Column(db.String(200),nullable=False)
    data =db.Column(db.String(),nullable=True)
    tags =db.Column(db.String(),nullable=True)
    @classmethod
    def update_element(cls,id_document,title,lang,path="",process="DEFAULT",tags="",data=""):
        document = Document.get_by_id(id_document)
        if document:

            document.title = title
            document.lang = lang
            document.path= path
            document.process = process
            document.tags = tags
            document.data= data
            db.session.add(document)
            db.session.commit()
            return document
        
        return False
    @classmethod
    def delete_element(cls,id_document,title,lang,path="",process="DEFAULT",tags="",data=""):
        doc = Document.query.filter_by(id_document=id).first()
        if doc is None: return False
        db.session.delete(doc)
        db.session.commit()
        return True
    @classmethod
    def create_element(cls,id_document,title,lang,path="",process="DEFAULT",tags="",data=""):
        doc = Document(id_document=id_document,title=title,lang=lang,path=path,process=process,data=data,tags=tags)
        
        # registrar nueva entrada en la BD
        db.session.add(doc)

        # registramos acciones
        db.session.commit()
        
    @classmethod
    def get_all(this):
        return Document.query.all()
    @classmethod
    def get_by_id(this,id):
        return Document.query.filter_by(id_document=id).first()

class User(db.Model, UserMixin):
    


    __tablename__ = 'users'

    # campos de la tabla
    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(50),nullable=False)
    password = db.Column(db.String(100),nullable=False)
    email = db.Column(db.String(50),unique=True,nullable=False)
    created_at = db.Column(db.DateTime,nullable=False,default=datetime.datetime.now())
    role = db.Column(db.String(),nullable=False)
    def verify_password(self,p_password):
        return check_password_hash(self.password, p_password)
    
    @classmethod
    def create_element(cls,name,password,email):
        user = User(name=name,password=generate_password_hash(password),email=email)
        
        # registrar nueva entrada en la BD
        db.session.add(user)

        # registramos acciones
        db.session.commit()
        return user

    
    @classmethod
    def get_by_username(cls, username):
        return User.query.filter_by(username=username).first()
    @classmethod
    def get_by_email(cls, email):
        return User.query.filter_by(email=email).first()
    @classmethod
    def get_by_id(cls, id):
        return User.query.filter_by(id=id).first()