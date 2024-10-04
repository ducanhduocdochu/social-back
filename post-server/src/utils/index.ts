'use strict';

import _ from 'lodash';
import { Types } from 'mongoose';
import bcrypt from 'bcrypt';

const convertToObjectIdMongodb = (id: string): Types.ObjectId => new Types.ObjectId(id);

const getInfoData = ({ fields = [], object = {} }: { fields: string[], object: any }) => {
    return _.pick(object, fields);
};

const getSelectData = (select: string[] = []): Record<string, 1> => {
    return Object.fromEntries(select.map(el => [el, 1]));
};

const unGetSelectData = (select: string[] = []): Record<string, 0> => {
    return Object.fromEntries(select.map(el => [el, 0]));
};

const removeUndefinedObject = (obj: Record<string, any>): Record<string, any> => {
    Object.keys(obj).forEach(k => {
        if (obj[k] == null) {
            delete obj[k];
        }
    });
    return obj;
};

const updateNestedObjectParser = (obj: Record<string, any>): Record<string, any> => {
    const final: Record<string, any> = {};
    Object.keys(obj).forEach(k => {
        if (typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
            const response = updateNestedObjectParser(obj[k]);
            Object.keys(response).forEach(a => {
                final[`${k}.${a}`] = response[a];
            });
        } else {
            final[k] = obj[k];
        }
    });
    return final;
};

async function generateSalt(): Promise<string> {
    try {
        const saltRounds = 10; // Number of rounds
        const salt = await bcrypt.genSalt(saltRounds);
        return salt;
    } catch (error) {
        throw error;
    }
}

export {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
    convertToObjectIdMongodb,
    generateSalt
};
