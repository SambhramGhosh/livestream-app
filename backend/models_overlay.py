from pymongo import MongoClient
from bson.objectid import ObjectId
from config import MONGO_URI, MONGO_DB, OVERLAYS_COLLECTION


client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
collection = db[OVERLAYS_COLLECTION]




def create_overlay(data):
    res = collection.insert_one(data)
    return str(res.inserted_id)

def get_all_overlays():
    docs = list(collection.find({}))
    for d in docs:
        d['id'] = str(d['_id'])
        del d['_id']
    return docs




def get_overlay(oid):   
    doc = collection.find_one({'_id': ObjectId(oid)})
    if not doc:
        return None
    doc['id'] = str(doc['_id']) 
    del doc['_id']
    return doc




def update_overlay(oid, data):
    collection.update_one({'_id': ObjectId(oid)}, {'$set': data})
    return get_overlay(oid)




def delete_overlay(oid):
    res = collection.delete_one({'_id': ObjectId(oid)})
    return res.deleted_count == 1