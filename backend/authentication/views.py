from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.paginator import Paginator
from .serializers import (
    StudentLoginSerializer, AdminLoginSerializer, UserSerializer,
    UserDetailSerializer, UserCreateSerializer, UserUpdateSerializer
)
from .models import UserProfile

@api_view(['POST'])
@permission_classes([AllowAny])
def student_login(request):
    """学生登录"""
    serializer = StudentLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        # 更新或创建用户资料，保存明文密码
        profile, created = UserProfile.objects.get_or_create(user=user)
        profile.plain_password = request.data.get('password')
        profile.save()
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': '登录成功',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)
    
    return Response({
        'message': '登录失败',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    """管理员登录"""
    serializer = AdminLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        # 更新或创建用户资料，保存明文密码
        profile, created = UserProfile.objects.get_or_create(user=user)
        profile.plain_password = request.data.get('password')
        profile.save()
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': '登录成功',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)
    
    return Response({
        'message': '登录失败',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """获取当前用户信息"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """用户登出"""
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        
        return Response({
            'message': '登出成功'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'message': '登出失败',
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token(request):
    """刷新访问令牌"""
    try:
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({
                'message': '需要提供刷新令牌'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        refresh = RefreshToken(refresh_token)
        return Response({
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'message': '令牌刷新失败',
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


def is_admin(user):
    """检查用户是否为管理员"""
    return user.groups.filter(name='管理员').exists()


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def user_management(request):
    """用户管理API - 获取用户列表和创建用户"""
    # 检查权限
    if not is_admin(request.user):
        return Response({
            'message': '权限不足'
        }, status=status.HTTP_403_FORBIDDEN)
    
    if request.method == 'GET':
        # 获取用户列表
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 20))
        user_type = request.GET.get('user_type')
        search = request.GET.get('search')
        
        # 基础查询
        users = User.objects.all().order_by('-date_joined')
        
        # 筛选用户类型
        if user_type == 'admin':
            users = users.filter(groups__name='管理员')
        elif user_type == 'student':
            users = users.exclude(groups__name='管理员')
        
        # 搜索
        if search:
            users = users.filter(
                username__icontains=search
            ) | users.filter(
                first_name__icontains=search
            ) | users.filter(
                last_name__icontains=search
            )
        
        # 分页
        paginator = Paginator(users, page_size)
        page_obj = paginator.get_page(page)
        
        serializer = UserDetailSerializer(page_obj.object_list, many=True)
        
        return Response({
            'results': serializer.data,
            'count': paginator.count,
            'page': page,
            'page_size': page_size,
            'total_pages': paginator.num_pages
        })
    
    elif request.method == 'POST':
        # 创建新用户
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                UserDetailSerializer(user).data,
                status=status.HTTP_201_CREATED
            )
        return Response({
            'message': '用户创建失败',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def user_detail(request, user_id):
    """用户详情API - 获取、更新、删除用户"""
    # 检查权限
    if not is_admin(request.user):
        return Response({
            'message': '权限不足'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({
            'message': '用户不存在'
        }, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        # 获取用户详情
        serializer = UserDetailSerializer(user)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        # 更新用户信息
        # 防止管理员删除自己的管理员权限
        if user.id == request.user.id and request.data.get('user_type') == 'student':
            return Response({
                'message': '不能取消自己的管理员权限'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            updated_user = serializer.save()
            return Response(UserDetailSerializer(updated_user).data)
        return Response({
            'message': '用户更新失败',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        # 删除用户
        # 防止管理员删除自己
        if user.id == request.user.id:
            return Response({
                'message': '不能删除自己的账户'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user.delete()
        return Response({
            'message': '用户删除成功'
        }, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_stats(request):
    """用户统计信息"""
    # 检查权限
    if not is_admin(request.user):
        return Response({
            'message': '权限不足'
        }, status=status.HTTP_403_FORBIDDEN)
    
    total_users = User.objects.count()
    admin_users = User.objects.filter(groups__name='管理员').count()
    student_users = total_users - admin_users
    active_users = User.objects.filter(is_active=True).count()
    
    return Response({
        'total_users': total_users,
        'admin_users': admin_users,
        'student_users': student_users,
        'active_users': active_users,
        'inactive_users': total_users - active_users
    })