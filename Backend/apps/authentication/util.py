from werkzeug.security import generate_password_hash, check_password_hash

def hash_pass(password):
    """Hacher le mot de passe"""
    print(f"🔐 Hachage du mot de passe: {password}")
    hashed = generate_password_hash(password)
    print(f"🔐 Mot de passe haché: {hashed}")
    return hashed

def verify_pass(plain_password, hashed_password):
    """Vérifier le mot de passe"""
    print(f"🔐 Vérification: {plain_password} vs {hashed_password}")
    
    # Solution pour Python 3 - pas de decode() nécessaire
    try:
        result = check_password_hash(hashed_password, plain_password)
        print(f"🔐 Résultat vérification: {result}")
        return result
    except Exception as e:
        print(f"❌ Erreur lors de la vérification: {e}")
        return False