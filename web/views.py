from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User


@login_required
def home_view(request):
    return render(request, 'home.html')


def login_view(request):
    context = None
    if request.method == 'POST':
        user = authenticate(username=request.POST['username'], password=request.POST['password'])
        if user is not None:
            login(request, user)
            return redirect(request.POST.get('next') or home_view)
        else:
            context = {'failure': 'Wrong credentials'}
            return render(request, 'login.html', context=context)
    else:
        return render(request, 'login.html')


@login_required
def logout_view(request):
    logout(request)
    return render(request, 'logout.html')


def register_view(request):
    context = None
    if request.method == 'POST':
        try:
            User.objects.get(username=request.POST['username'])
            context = {'failure': 'Username already in use'}
            return render(request, 'register.html', context=context)
        except User.DoesNotExist:
            new_user = User.objects.create_user(username=request.POST['username'],
                                                email=request.POST['email'],
                                                password=request.POST['password'])
            login(request, new_user)
            return redirect(home_view)
    else:
        return render(request, 'register.html')
