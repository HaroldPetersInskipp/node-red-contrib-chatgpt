module.exports = (RED) => {
    const { Configuration, OpenAIApi } = require("openai");
    const ACCEPT_TOPIC_LIST = [
        "completion",
        "image",
        "edit",
        "turbo",
        "gpt4",
    ].map((item) => item.toLowerCase());
    const main = function (config) {
        const node = this;
        RED.nodes.createNode(node, config);
        const API_KEY = config.API_KEY;
        const ORGANIZATION = config.Organization;
        const configuration = new Configuration({
            organization: ORGANIZATION,
            apiKey: API_KEY,
        });
        if (config.BaseUrl) {
            try {
                const url = new URL(config.BaseUrl);
                if (url.pathname === "/") {
                    url.pathname = "/v1";
                }
                configuration.basePath = url.toString();
            } catch {
                node.status({
                    fill: "red",
                    shape: "dot",
                    text: `BaseUrl(${config.BaseUrl}) isn't a valid url`,
                });
            }
        }
        const openai = new OpenAIApi(configuration);

        node.on("input", async (msg) => {
            node.status({
                fill: "green",
                shape: "dot",
                text: "Processing...",
            });
            if (config.topic != "__EMPTY__") {
                msg.topic = config.topic;
            }
            if (msg.topic) {
                msg.topic = msg.topic.toLowerCase();
            }
            if (
                !ACCEPT_TOPIC_LIST.includes(msg.topic) &&
                msg.topic !== "__empty__"
            ) {
                node.status({
                    fill: "red",
                    shape: "dot",
                    text: "msg.topic is incorrect",
                });
                node.error(
                    `msg.topic must be a string set to one of the following values: ${ACCEPT_TOPIC_LIST.map(
                        (item) => `'${item}'`
                    ).join(", ")}`
                );
                node.send(msg);
            } else if (msg.topic === "image") {
                try {
                    const response = await openai.createImage({
                        prompt: msg.payload,
                        n: parseInt(msg.n) || 1,
                        size: msg.size || "256x256",
                        response_format: msg.format || "b64_json",
                    });
                    if (msg.format === "url") {
                        msg.payload = response.data.data[0].url;
                    } else {
                        msg.payload = response.data.data[0].b64_json;
                    }

                    msg.full = response;
                    node.status({
                        fill: "blue",
                        shape: "dot",
                        text: "Response complete",
                    });
                    node.send(msg);
                } catch (error) {
                    node.status({
                        fill: "red",
                        shape: "dot",
                        text: "Error",
                    });
                    if (error.response) {
                        node.error(error.response.status, msg);
                        node.error(error.response.data, msg);
                    } else {
                        node.error(error.message, msg);
                    }
                }
            } else if (msg.topic === "edit") {
                try {
                    const response = await openai.createEdit({
                        model: "text-davinci-edit-001",
                        instruction: msg.payload,
                        n: parseInt(msg.n) || 1,
                        input: msg.last || "",
                        temperature: parseInt(msg.temperature) || 1,
                        top_p: parseInt(msg.top_p) || 1,
                    });
                    msg.payload = response.data.choices[0].text;
                    msg.full = response;
                    node.status({
                        fill: "blue",
                        shape: "dot",
                        text: "Response complete",
                    });
                    node.send(msg);
                } catch (error) {
                    node.status({
                        fill: "red",
                        shape: "dot",
                        text: "Error",
                    });
                    if (error.response) {
                        node.error(error.response.status, msg);
                        node.error(error.response.data, msg);
                    } else {
                        node.error(error.message, msg);
                    }
                }
            } else if (msg.topic === "turbo" || msg.topic === 'turbo-16k') {
                try {
                    if (typeof msg.history === "undefined") msg.history = [];
                    msg.topic = "turbo";
                    const input = {
                        role: "user",
                        content: msg.payload,
                    };
                    msg.history.push(input);
                    const response = await openai.createChatCompletion({
                        model: `gpt-3.5-turbo${msg.topic}`,
                        messages: msg.history,
                        temperature: parseInt(msg.temperature) || 1,
                        top_p: parseInt(msg.top_p) || 1,
                        n: parseInt(msg.n) || 1,
                        stream: msg.stream || false,
                        stop: msg.stop || null,
                        max_tokens: parseInt(msg.max_tokens) || 4000,
                        presence_penalty: parseInt(msg.presence_penalty) || 0,
                        frequency_penalty: parseInt(msg.frequency_penalty) || 0,
                    });
                    const trimmedContent =
                        response.data.choices[0].message.content.trim();
                    const result = {
                        role: "assistant",
                        content: trimmedContent,
                    };
                    msg.history.push(result);
                    msg.payload = response.data.choices[0].message.content;
                    msg.full = response;
                    node.status({
                        fill: "blue",
                        shape: "dot",
                        text: "Response complete",
                    });
                    node.send(msg);
                } catch (error) {
                    node.status({
                        fill: "red",
                        shape: "dot",
                        text: "Error",
                    });
                    if (error.response) {
                        node.error(error.response.status, msg);
                        node.error(error.response.data, msg);
                    } else {
                        node.error(error.message, msg);
                    }
                }
            } else if (msg.topic === "gpt4") {
                try {
                    if (typeof msg.history === "undefined") msg.history = [];
                    msg.topic = "gpt4";
                    const input = {
                        role: "user",
                        content: msg.payload,
                    };
                    msg.history.push(input);
                    const response = await openai.createChatCompletion({
                        model: "gpt-4",
                        messages: msg.history,
                        temperature: parseInt(msg.temperature) || 1,
                        top_p: parseInt(msg.top_p) || 1,
                        n: parseInt(msg.n) || 1,
                        stream: msg.stream || false,
                        stop: msg.stop || null,
                        max_tokens: parseInt(msg.max_tokens) || 4000,
                        presence_penalty: parseInt(msg.presence_penalty) || 0,
                        frequency_penalty: parseInt(msg.frequency_penalty) || 0,
                    });
                    const trimmedContent =
                        response.data.choices[0].message.content.trim();
                    const result = {
                        role: "assistant",
                        content: trimmedContent,
                    };
                    msg.history.push(result);
                    msg.payload = response.data.choices[0].message.content;
                    msg.full = response;
                    node.status({
                        fill: "blue",
                        shape: "dot",
                        text: "Response complete",
                    });
                    node.send(msg);
                } catch (error) {
                    node.status({
                        fill: "red",
                        shape: "dot",
                        text: "Error",
                    });
                    if (error.response) {
                        node.error(error.response.status, msg);
                        node.error(error.response.data, msg);
                    } else {
                        node.error(error.message, msg);
                    }
                }
            } else {
                try {
                    msg.topic = "completion";
                    const response = await openai.createCompletion({
                        model: "text-davinci-003",
                        prompt: msg.payload,
                        suffix: msg.suffix || null,
                        max_tokens: parseInt(msg.max_tokens) || 4000,
                        temperature: parseInt(msg.temperature) || 1,
                        top_p: parseInt(msg.top_p) || 1,
                        n: parseInt(msg.n) || 1,
                        stream: msg.stream || false,
                        logprobs: parseInt(msg.logprobs) || null,
                        echo: msg.echo || false,
                        stop: msg.stop || null,
                        presence_penalty: parseInt(msg.presence_penalty) || 0,
                        frequency_penalty: parseInt(msg.frequency_penalty) || 0,
                        best_of: parseInt(msg.best_of) || 1,
                    });
                    msg.payload = response.data.choices[0].text;
                    msg.full = response;
                    node.status({
                        fill: "blue",
                        shape: "dot",
                        text: "Response complete",
                    });
                    node.send(msg);
                } catch (error) {
                    node.status({
                        fill: "red",
                        shape: "dot",
                        text: "Error",
                    });
                    if (error.response) {
                        node.error(error.response.status, msg);
                        node.error(error.response.data, msg);
                    } else {
                        node.error(error.message, msg);
                    }
                }
            }
        });
        // clear the node status(invalid option tips)
        node.on("close", () => {
            node.status({});
        });
    };

    RED.nodes.registerType("chatgpt", main);
};
