from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.models import User, Group
from .models import UserProfile

class LoginSerializer(serializers.Serializer):
    """登录序列化器"""
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('用户名或密码错误')
            if not user.is_active:
                raise serializers.ValidationError('用户账号已被禁用')
                
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('请提供用户名和密码')

class StudentLoginSerializer(LoginSerializer):
    """学生登录序列化器"""
    def validate(self, attrs):
        attrs = super().validate(attrs)
        user = attrs['user']
        # 检查用户是否属于管理员组，如果是，则不能用学生登录
        if user.groups.filter(name='管理员').exists():
            raise serializers.ValidationError('此账号不是学生账号')
        return attrs

class AdminLoginSerializer(LoginSerializer):
    """管理员登录序列化器"""
    def validate(self, attrs):
        attrs = super().validate(attrs)
        user = attrs['user']
        # 检查用户是否属于管理员组
        if not user.groups.filter(name='管理员').exists():
            raise serializers.ValidationError('此账号不是管理员账号')
        return attrs

class UserSerializer(serializers.ModelSerializer):
    """用户信息序列化器"""
    user_type = serializers.SerializerMethodField()
    student_id = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 
                 'user_type', 'student_id', 'is_active', 'date_joined']
        read_only_fields = ['id', 'date_joined']
    
    def get_user_type(self, obj):
        """获取用户类型"""
        if obj.groups.filter(name='管理员').exists():
            return 'admin'
        return 'student'
    
    def get_student_id(self, obj):
        """获取学号"""
        try:
            profile = UserProfile.objects.get(user=obj)
            return profile.student_id
        except UserProfile.DoesNotExist:
            return None


class UserDetailSerializer(serializers.ModelSerializer):
    """用户详细信息序列化器（用于管理界面）"""
    user_type = serializers.SerializerMethodField()
    student_id = serializers.SerializerMethodField()
    plain_password = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 
                 'user_type', 'student_id', 'plain_password', 'is_active', 
                 'date_joined', 'last_login']
        read_only_fields = ['id', 'date_joined', 'last_login']
    
    def get_user_type(self, obj):
        """获取用户类型"""
        if obj.groups.filter(name='管理员').exists():
            return 'admin'
        return 'student'
    
    def get_student_id(self, obj):
        """获取学号"""
        try:
            profile = UserProfile.objects.get(user=obj)
            return profile.student_id
        except UserProfile.DoesNotExist:
            return None
    
    def get_plain_password(self, obj):
        """获取明文密码"""
        try:
            profile = UserProfile.objects.get(user=obj)
            return profile.plain_password
        except UserProfile.DoesNotExist:
            return None


class UserCreateSerializer(serializers.ModelSerializer):
    """用户创建序列化器"""
    password = serializers.CharField(write_only=True)
    user_type = serializers.ChoiceField(choices=[('student', '学生'), ('admin', '管理员')], write_only=True)
    student_id = serializers.CharField(max_length=20, required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'last_name', 'email', 
                 'user_type', 'student_id', 'is_active']
    
    def validate_username(self, value):
        """验证用户名唯一性"""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('该用户名已存在')
        return value
    
    def create(self, validated_data):
        """创建用户"""
        user_type = validated_data.pop('user_type')
        student_id = validated_data.pop('student_id', '')
        password = validated_data.pop('password')
        
        # 创建用户
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        
        # 创建用户资料
        UserProfile.objects.create(
            user=user,
            student_id=student_id,
            plain_password=password
        )
        
        # 设置用户组
        if user_type == 'admin':
            admin_group, created = Group.objects.get_or_create(name='管理员')
            user.groups.add(admin_group)
        
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    """用户更新序列化器"""
    password = serializers.CharField(write_only=True, required=False)
    user_type = serializers.ChoiceField(
        choices=[('student', '学生'), ('admin', '管理员')], 
        write_only=True, 
        required=False
    )
    student_id = serializers.CharField(max_length=20, required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'last_name', 'email', 
                 'user_type', 'student_id', 'is_active']
    
    def update(self, instance, validated_data):
        """更新用户"""
        user_type = validated_data.pop('user_type', None)
        student_id = validated_data.pop('student_id', None)
        password = validated_data.pop('password', None)
        
        # 更新用户基本信息
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # 更新密码
        if password:
            instance.set_password(password)
        
        instance.save()
        
        # 更新或创建用户资料
        profile, created = UserProfile.objects.get_or_create(user=instance)
        if student_id is not None:
            profile.student_id = student_id
        if password:
            profile.plain_password = password
        profile.save()
        
        # 更新用户组
        if user_type is not None:
            admin_group, created = Group.objects.get_or_create(name='管理员')
            if user_type == 'admin':
                instance.groups.add(admin_group)
            else:
                instance.groups.remove(admin_group)
        
        return instance
