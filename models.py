from werkzeug.security import generate_password_hash, check_password_hash

import datetime

from flask_login import UserMixin

from flask_sqlalchemy import SQLAlchemy

db =SQLAlchemy()

class Role(db.Model):
    __tablename__ = 'roles'
    id_role = db.Column(db.Integer,primary_key=True)
    name = name = db.Column(db.String(30),nullable=False)
    description = db.Column(db.String(200),nullable=False)

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