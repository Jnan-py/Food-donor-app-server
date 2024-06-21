const testController = (req,res) => {
    res.status(200).send({
        message : "Welcome to server",
        status : true,
    });
};

module.exports = {testController};