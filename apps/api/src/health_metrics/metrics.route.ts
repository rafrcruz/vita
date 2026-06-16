import { Router } from 'express';
import { createWeightLog, createBPLog, getWeightHistory, getBPHistory, updateWeightLog, deleteWeightLog, updateBPLog, deleteBPLog } from './metrics.service';

const router = Router();

router.get('/weight', async (req, res, next) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      res.status(401).json({ error: { code: 'unauthenticated', message: 'Autenticação necessária.' } });
      return;
    }
    const timeframe = req.query.timeframe as string | undefined;
    const logs = await getWeightHistory(userEmail, timeframe);
    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
});

router.post('/weight', async (req, res, next) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      res.status(401).json({ error: { code: 'unauthenticated', message: 'Autenticação necessária.' } });
      return;
    }
    const log = await createWeightLog(userEmail, req.body);
    res.status(201).json(log);
  } catch (error) {
    next(error);
  }
});

router.put('/weight/:id', async (req, res, next) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      res.status(401).json({ error: { code: 'unauthenticated', message: 'Autenticação necessária.' } });
      return;
    }
    const log = await updateWeightLog(req.params.id, userEmail, req.body);
    res.status(200).json(log);
  } catch (error) {
    next(error);
  }
});

router.delete('/weight/:id', async (req, res, next) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      res.status(401).json({ error: { code: 'unauthenticated', message: 'Autenticação necessária.' } });
      return;
    }
    await deleteWeightLog(req.params.id, userEmail);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.get('/blood-pressure', async (req, res, next) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      res.status(401).json({ error: { code: 'unauthenticated', message: 'Autenticação necessária.' } });
      return;
    }
    const timeframe = req.query.timeframe as string | undefined;
    const logs = await getBPHistory(userEmail, timeframe);
    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
});

router.post('/blood-pressure', async (req, res, next) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      res.status(401).json({ error: { code: 'unauthenticated', message: 'Autenticação necessária.' } });
      return;
    }
    const log = await createBPLog(userEmail, req.body);
    res.status(201).json(log);
  } catch (error) {
    next(error);
  }
});

router.put('/blood-pressure/:id', async (req, res, next) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      res.status(401).json({ error: { code: 'unauthenticated', message: 'Autenticação necessária.' } });
      return;
    }
    const log = await updateBPLog(req.params.id, userEmail, req.body);
    res.status(200).json(log);
  } catch (error) {
    next(error);
  }
});

router.delete('/blood-pressure/:id', async (req, res, next) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      res.status(401).json({ error: { code: 'unauthenticated', message: 'Autenticação necessária.' } });
      return;
    }
    await deleteBPLog(req.params.id, userEmail);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
