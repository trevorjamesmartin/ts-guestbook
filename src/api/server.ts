import express from 'express';
import configureServer from './configure';
import configureRoutes from './routes';
export default configureRoutes(configureServer(express()));
