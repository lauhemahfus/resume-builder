<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume Builder - Create Professional Resumes</title>
    <link rel="icon" type="image/png" href="icon.png">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
        }

        body {
            background-color: #f5f5f5;
        }

        .hero {
            min-height: 100vh;
            background: linear-gradient(45deg, #00214d, #002966);
            color: white;
            position: relative;
            overflow: hidden;
        }

        .navbar {
            padding: 20px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            z-index: 1;
        }

        .logo {
            font-size: 24px;
            font-weight: bold;
            color: white;
            text-decoration: none;
        }

        .nav-buttons {
            display: flex;
            gap: 20px;
        }

        .nav-btn {
            padding: 10px 25px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .login-btn {
            color: white;
            border: 2px solid white;
        }

        .login-btn:hover {
            background: white;
            color: #002966;
        }

        .signup-btn {
            background: #FF416C;
            color: white;
            border: 2px solid #FF416C;
        }

        .signup-btn:hover {
            background: #ff2c55;
            border-color: #ff2c55;
        }

        .hero-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 80px 40px;
            position: relative;
            z-index: 1;
        }

        .hero-text {
            max-width: 600px;
        }

        .hero-text h1 {
            font-size: 3.5rem;
            margin-bottom: 20px;
            line-height: 1.2;
        }

        .hero-text p {
            font-size: 1.2rem;
            margin-bottom: 30px;
            opacity: 0.9;
        }

        .cta-btn {
            display: inline-block;
            padding: 15px 40px;
            background: #FF416C;
            color: white;
            text-decoration: none;
            border-radius: 30px;
            font-weight: 500;
            font-size: 1.1rem;
            transition: all 0.3s ease;
        }

        .cta-btn:hover {
            background: #ff2c55;
            transform: translateY(-2px);
        }

        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            margin-top: 80px;
        }

        .feature-card {
            background: rgba(255, 255, 255, 0.1);
            padding: 30px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            transition: transform 0.3s ease;
        }

        .feature-card:hover {
            transform: translateY(-5px);
        }

        .feature-card i {
            font-size: 2rem;
            margin-bottom: 20px;
            color: #FF416C;
        }

        .feature-card h3 {
            margin-bottom: 15px;
        }

        .feature-card p {
            opacity: 0.8;
            font-size: 0.9rem;
        }

        .background-animation {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 0;
        }

        .circle {
            position: absolute;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
        }

        .circle-1 {
            width: 300px;
            height: 300px;
            top: -150px;
            right: -150px;
        }

        .circle-2 {
            width: 500px;
            height: 500px;
            bottom: -250px;
            left: -250px;
        }

        @media (max-width: 768px) {
            .hero-text h1 {
                font-size: 2.5rem;
            }

            .features {
                grid-template-columns: 1fr;
            }

            .navbar {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="hero">
        <nav class="navbar">
            <a href="index.php" class="logo">Resume Builder</a>
            <div class="nav-buttons">
                <a href="login.html" class="nav-btn login-btn">Login</a>
                <a href="signup.html" class="nav-btn signup-btn">Sign Up</a>
            </div>
        </nav>

        <div class="hero-content">
            <div class="hero-text">
                <h1>Create Professional Resumes in Minutes</h1>
                <p>Build stunning, professional resumes with our easy-to-use builder. Stand out from the crowd and land your dream job.</p>
                <a href="signup.html" class="cta-btn">Get Started Free</a>
            </div>

            <div class="features">
                <div class="feature-card">
                    <i class="fas fa-wand-magic-sparkles"></i>
                    <h3>Multiple Templates</h3>
                    <p>Choose from our professionally designed templates to make your resume stand out.</p>
                </div>
                <div class="feature-card">
                    <i class="fas fa-download"></i>
                    <h3>Easy Export</h3>
                    <p>Download your resume in PDF format with just one click.</p>
                </div>
                <div class="feature-card">
                    <i class="fas fa-pen-to-square"></i>
                    <h3>Easy to Edit</h3>
                    <p>Update your resume anytime with our user-friendly interface.</p>
                </div>
            </div>
        </div>

        <div class="background-animation">
            <div class="circle circle-1"></div>
            <div class="circle circle-2"></div>
        </div>
    </div>
</body>
</html>