const hash = crypto.createHmac('shah256', smskey).update(data).digest('hex');
    const fullHash = `${hash}.${expires}`;