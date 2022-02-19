import {Express, Request, Response} from "express";
import MessageControllerI from "../interfaces/MessageControllerI";
import MessageDao from "../daos/MessageDao";
import Message from "../models/messages/Message";
import {stat} from "fs";

export default class MessageController implements MessageControllerI {
    private static messageDao: MessageDao = MessageDao.getInstance();
    private static messageController: MessageController | null = null;

    public static getInstance = (app: Express): MessageController => {
        if (MessageController.messageController === null) {
            MessageController.messageController = new MessageController();
            app.post('/api/users/:uid/messages/:auid', MessageController.messageController.userSendsMessage);
            app.delete('/api/messages/:mid', MessageController.messageController.userDeletesMessage);
            app.get('/api/users/:uid/messages/sent', MessageController.messageController.findAllMessageSent);
            app.get('/api/users/:uid/messages/received', MessageController.messageController.findAllMessageReceived);
            app.get('/api/messages', MessageController.messageController.findAllMessage);
        }
        return MessageController.messageController;
    }

    private constructor() {}

    findAllMessageSent = (req: Request, res: Response) =>
        MessageController.messageDao.findAllMessageSent(req.params.uid)
            .then((messages: Message[]) => res.json(messages));

    findAllMessageReceived = (req: Request, res: Response) =>
        MessageController.messageDao.findAllMessageReceived(req.params.uid)
            .then((messages: Message[]) => res.json(messages));

    userSendsMessage = (req: Request, res: Response) =>
        MessageController.messageDao.userSendsMessage(req.body, req.params.uid, req.params.auid)
            .then((message: Message) => res.json(message));

    userDeletesMessage = (req: Request, res: Response) =>
        MessageController.messageDao.userDeletesMessage(req.params.mid)
            .then(status => res.send(status));

    findAllMessage = (req: Request, res: Response) =>
        MessageController.messageDao.findAllMessage()
            .then((messages: Message[]) => res.json(messages));
}