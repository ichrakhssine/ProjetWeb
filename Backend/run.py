from apps import create_app, db
from apps.models import User, UserRole

app = create_app()

def create_admin_user():
    with app.app_context():
        db.create_all()
        
        # Vérifier si l'admin existe déjà
        admin_email = 'admin@example.com'
        admin_user = User.query.filter_by(email=admin_email).first()
        
        if not admin_user:
            print("🐛 Création du compte admin...")
            admin = User(
                email=admin_email,
                nom='Admin',
                prenom='System',
                role=UserRole.ADMIN
            )
            admin.set_password('admin123')
            try:
                db.session.add(admin)
                db.session.commit()
                print('✅ Compte admin créé avec succès')
                print('   Email: admin@example.com')
                print('   Mot de passe: admin123')
            except Exception as e:
                print(f'❌ Erreur création admin: {e}')
        else:
            print('✅ Compte admin existe déjà')
            print(f'   ID: {admin_user.id}')
            print(f'   Email: {admin_user.email}')
            print(f'   Rôle: {admin_user.role}')
            
        # Vérifier tous les utilisateurs dans la base
        all_users = User.query.all()
        print(f"🐛 Utilisateurs dans la base: {len(all_users)}")
        for u in all_users:
            print(f"🐛 - {u.email} ({u.role})")

if __name__ == '__main__':
    create_admin_user()
    print('🚀 Serveur démarré sur http://localhost:5000')
    app.run(debug=True, host='0.0.0.0', port=5000)