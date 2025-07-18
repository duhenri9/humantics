import request from 'supertest';
import app from '../server/app'; // ajuste o caminho conforme seu entrypoint Express

describe('Auth, Leads e Pagamentos', () => {
  let token = '';
  let leadId = '';
  let paymentIntentId = '';

  const testUser = {
    email: `test${Date.now()}@mail.com`,
    password: 'senhaSegura123'
  };

  it('deve registrar um novo usuário', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send(testUser);
    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/registrado/);
  });

  it('deve fazer login e receber um JWT', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send(testUser);
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it('deve criar um lead protegido', async () => {
    const res = await request(app)
      .post('/leads')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Lead Teste', email: 'lead@mail.com', phone: '11999999999' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    leadId = res.body.id;
  });

  it('deve criar um PaymentIntent Stripe protegido', async () => {
    const res = await request(app)
      .post('/payments/intent')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 5000, currency: 'brl' });
    expect(res.status).toBe(200);
    expect(res.body.clientSecret).toBeDefined();
    paymentIntentId = res.body.id;
  });

  it('deve consultar o PaymentIntent criado', async () => {
    const res = await request(app)
      .get(`/payments/intent/${paymentIntentId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(paymentIntentId);
  });
});
