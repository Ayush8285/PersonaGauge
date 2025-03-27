# only for test
from django.shortcuts import render
from .models import user_collection
from django.http import HttpResponse
# Create your views here.

def index(request):
    return HttpResponse("<h1> Hello World app is working </h1>")



def add_user(request):
    records={
        'name':'John Doe',
        'country':'USA',    
    }

    user_collection.insert_one(records)
    return HttpResponse("<h1> user addd </h1>")


