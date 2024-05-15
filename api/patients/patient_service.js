module.exports = { 
    (req, res) => {
        getUsers((err, results) => {
          if (err) {
            console.log(err);
            logger.error(err);
            return;
          }
          return res.json({
            status: 200,
            data: results
          });
        });
      },
}