import { Router } from 'express';
import { getProfile, upsertProfile } from './profile.service';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      res.status(401).json({ error: { code: 'unauthenticated', message: 'Autenticação necessária.' } });
      return;
    }
    const profile = await getProfile(userEmail);
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      res.status(401).json({ error: { code: 'unauthenticated', message: 'Autenticação necessária.' } });
      return;
    }
    const profile = await upsertProfile(userEmail, req.body);
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
});

export default router;
