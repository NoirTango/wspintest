from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, logout, authenticate


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


def logout_view(request):
    logout(request)
    return render(request, 'logout.html')


def register_view(request):
    return redirect('home')
