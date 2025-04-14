export const RESET_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>datman Alert | Password Reset OTP</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Arial:wght@300;400;700&display=swap');
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; color: #29303F;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Main Content -->
        <div style="padding: 0px 20px 30px 20px">
            <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Dear User,</p>
            <p style="font-size: 16px; line-height: 1.5; margin-bottom: 50px;">Enter this OTP to complete your password reset:</p>
            <div style="background-color: #e9ecef; padding: 13px; font-size: 24px; font-weight: bold; border-radius: 5px; text-align: center; max-width: 150px; margin: 0 auto;">
                {{otp}}
            </div>
            <p style="font-size: 14px; color: #565A65; margin-top: 50px;">This OTP expires in 15 minutes</p>
            
        </div>

        <!-- Disclaimer -->
        <div style="background-color: #f8f9fa; padding: 10px 20px; font-size: 13px; color: #91949A; border-top: 1px solid #DDDDDD;">
            <p><strong>Disclaimer:</strong> This message is confidential and intended solely for the addressee. If you are not the intended recipient, please do not access or use it.</p>
        </div>
    </div>
</body>
</html>
`

export const VERIFY_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>datman Alert | Verification OTP</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Arial:wght@300;400;700&display=swap');
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; color: #29303F;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Main Content -->
        <div style="padding: 0px 20px 30px 20px">
          <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Hello,</p>
          <p style="font-size: 16px; line-height: 1.5; margin-bottom: 50px;">To complete your verification process, please use the following one-time password (OTP):</p>
            <div style="background-color: #e9ecef; padding: 13px; font-size: 24px; font-weight: bold; border-radius: 5px; text-align: center; max-width: 150px; margin: 0 auto;">
                {{otp}}
            </div>
            <p style="font-size: 14px; color: #565A65; margin-top: 50px;">This OTP expires in 10 minutes</p>
        </div>

        <!-- Disclaimer -->
        <div style="background-color: #f8f9fa; padding: 10px 20px; font-size: 13px; color: #91949A; border-top: 1px solid #DDDDDD;">
            <p><strong>Disclaimer:</strong> This message is confidential and intended solely for the addressee. If you are not the intended recipient, please do not access or use it.</p>
        </div>
    </div>
</body>
</html>
`