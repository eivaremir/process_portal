from werkzeug.security import generate_password_hash, check_password_hash
import datetime
from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy

##########################################
# EMAIL
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
##########################################

db =SQLAlchemy()

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


class Email(db.Model):
    __tablename__ = 'emails'
    id_email = db.Column(db.Integer,primary_key=True)
    html = db.Column(db.String(),nullable=False)
    subject = db.Column(db.String(255),nullable=False)
    email_from = db.Column(db.String(30),nullable=False)
    

    def send(self,to,s):
        self.msg = MIMEMultipart('alternative')
        self.msg['Subject'] = self.subject
        self.msg['From'] = self.email_from
        self.msg['To'] = to
        self.msg.attach(MIMEText(self.html, 'html'))
        
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
    
    @classmethod
    def delete_element(cls,id):
        doc = Document.query.filter_by(id_document=id).first()
        if doc is None: return False
        db.session.delete(doc)
        db.session.commit()
        return True
    @classmethod
    def create_element(cls,id_document,title,lang,path,process):
        doc = Document(id_document=id_document,title=title,lang=lang,path=path,process=process)
        
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