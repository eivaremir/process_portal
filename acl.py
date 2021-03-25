from miracle import Acl
import pickle


try:
    file = open('acl', 'rb')

    # dump information to that file
    # FIX LIBRARY
    acl = pickle.load(file)

    # close the file
    file.close()


except:
    acl = Acl()

acl.add_roles([
    'everyone', 
    'admin',
])

acl.add({
    'document': {'create', 'read', 'update', 'delete','full_control'},
    'role': {'create', 'read', 'update', 'delete','full_control'},
})
######################################
# GRANT DOCUMENT

acl.grants({
    'everyone': {
        'document': ['create', 'read', 'update', 'delete'],
        'role':[]
    },
    'admin': {
        'document': ['full_control'],
        'role': ['full_control'],
    }
})

######################################
def has_view_access(resource,user):
    return acl.check_any(user.role.split(","),resource,"read") or acl.check_any(user.role.split(","),resource,"full_control") if user.role else False

file = open('acl', 'wb')

# dump information to that file
pickle.dump(acl, file)

# close the file
file.close()