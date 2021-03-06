from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User


@login_required
def home_view(request):
    return render(request, 'home.html')


@login_required
def stats_view(request):
    return render(request, 'stats.html')


@login_required
def grades_view(request):
    return render(request, 'grades.html')


@login_required
def import_view(request):
    return render(request, 'import.html')


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
            User.objects.get(username=request.POST['email'])
            context = {'failure': 'User with this e-mail is already registered'}
            return render(request, 'register.html', context=context)
        except User.DoesNotExist:
            new_user = User.objects.create_user(username=request.POST['email'],
                                                email=request.POST['email'],
                                                first_name=request.POST['name'],
                                                last_name=request.POST['surname'],
                                                password=request.POST['password'])
            login(request, new_user)
            return redirect(home_view)
    else:
        return render(request, 'register.html')
