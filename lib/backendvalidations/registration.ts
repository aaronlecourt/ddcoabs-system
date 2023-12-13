import User from '../../models/User';


export const validateRegistrationRequest = async (body: any) => {
    let errorMessages: string[] = [];

    const requiredRegistrationFields: string[] = [
      'name',
      'email',
      'address',
      'contactNumber',
      'dateOfBirth',
      'sex',
      'password',
      'confirmPassword'
    ];
    const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);

    // validation of required registration fields
    requiredRegistrationFields.map(v => {
        if (!body[v])
            errorMessages.push(`${v} is required.`);

        if (['password', 'confirmPassword'].find(key => key == v)) {
            if (body[v] && body[v].length < 8)
                errorMessages.push(`${v} should be at least 8 characters.`);
        
            if (body[v] && !passwordRegex.test(body[v]))
                errorMessages.push(`${v} should contain at least a capital letter, small letter, special characters and numbers.`);
        }
    });

    // validation of duplicate email
    const emailDuplicate = await User.findOne({ email: body.email });
    if (emailDuplicate) errorMessages.push('Email address already exists');

    // validation of matching password and confirmPassword
    if (body.password !== body.confirmPassword) {
        errorMessages.push('password and confirmPassword does not match');
    }
    
    return {
        isValid: !errorMessages.length,
        errorMessages: errorMessages
    }
}