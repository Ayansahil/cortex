import jwt from 'jsonwebtoken';
const token = jwt.sign({ userId: '65e9f9c0e7b8c8d8f9a9c8b7' }, '36a67ad9b5aa185c60c8e39bd1f344176ae15e06');
console.log(token);
