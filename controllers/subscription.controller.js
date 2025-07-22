import workflowClient from '../config/upstash.js';
import Subscription from '../models/subscription.model.js'
import { SERVER_URL } from '../config/env.js';



export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

        const { WorkflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: { subscriptionId: subscription.id },
            headers: { 'content-type': 'application/json' },
        });

        res.status(201).json({
            success: true,
            data: subscription,
            workflowRunId: WorkflowRunId, // ✅ now included
        });
    } catch (e) {
        next(e);
    }
};


export const getUserSubscriptions = async (req, res, next) => {
    try {
        if (req.user.id != req.params.id) {
            const error = new Error('You are not the owner of this account');
            error.status = 401;
            throw error;
        }
        const subscriptions = await Subscription.find({ user: req.params.id });
        res.status(200).json({ success: true, data: subscriptions });

    } catch (e) {
        next(e);
    }
}




export const getAllSubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await Subscription.find(); // fetch all
        res.status(200).json({ success: true, data: subscriptions });
    } catch (e) {
        next(e);
    }
};

export const getSubscriptionById = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            return res.status(404).json({ success: false, message: 'Subscription not found' });
        }

        res.status(200).json({ success: true, data: subscription });
    } catch (e) {
        next(e);
    }
};
