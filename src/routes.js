import cors from 'cors';
import express, { Router } from 'express';
import fileUpload from 'express-fileupload';
import FileManagementConfig from './config/filemanagement';

import authMiddleware from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import AnnouncementController from './app/controllers/AnnouncementController';
import ComponentController from './app/controllers/ComponentController';
import CompanyController from './app/controllers/CompanyController';
import MessageController from './app/controllers/MessageController';

const routes = new Router();

routes.use(cors());

routes.post('/sessions', SessionController.store);
routes.post('/sendMessage', MessageController.send.bind(MessageController));
routes.use('/files', express.static(FileManagementConfig.public.path));

// routes.use(authMiddleware);
routes.post('/users', UserController.store);
routes.put('/users', UserController.update);

// Rotas anúncios
routes.get('/announcements', AnnouncementController.getAllForListing);
routes.get('/announcements/:id', AnnouncementController.getById.bind(AnnouncementController));
routes.post('/announcements', AnnouncementController.store.bind(AnnouncementController));
routes.put('/announcements/:id', AnnouncementController.update.bind(AnnouncementController));
routes.delete('/announcements/:id', AnnouncementController.delete.bind(AnnouncementController));

// Rotas componentes
routes.get('/components', ComponentController.getAllForListing);
routes.post('/components', ComponentController.store.bind(ComponentController));
routes.put('/components/:id', ComponentController.update.bind(ComponentController));
routes.delete('/components/:id', ComponentController.delete.bind(ComponentController));

// Rota dados da empresa
routes.post('/company', CompanyController.store.bind(CompanyController));


routes.delete('/files', AnnouncementController.deleteFilesByIds.bind(AnnouncementController));
routes.use(fileUpload(FileManagementConfig.fileUploadConfig));
routes.post('/announcements/files/:announcementId', AnnouncementController.storeFiles.bind(AnnouncementController));

export default routes;