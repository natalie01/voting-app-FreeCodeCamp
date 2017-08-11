
var  express = require('express');
var router = express.Router();
// Poll Model
var Poll = require('../models/poll');
// User Model
var User = require('../models/user');


// Add Route
router.get('/add', ensureAuthenticated, function(req, res){
	res.render('add_poll', {
	title:'Add Poll'
	});
});

// Add Submit POST Route

router.post('/add', function(req, res){
	req.checkBody('title','Title is required').notEmpty();
	//req.checkBody('author','Author is required').notEmpty();
	req.checkBody('option0','First Option is required').notEmpty();
	req.checkBody('option1','Second Option is required').notEmpty();
	// Get Errors
	var errors = req.validationErrors();
  console.log(errors)
	if(errors){
		res.render('add_poll', {
		title:'Add Poll',
		errors:errors
		});
	} else {
	let poll = new Poll();

	poll.title = req.body.title;
	poll.author = req.user._id;

	poll.options = 
			[{op:0,option:req.body.option0,votes :0},
			{op:1,option:req.body.option1 ,votes :0},
			{op:2,option:req.body.option2 ,votes :0},
			{op:3,option:req.body.option3 ,votes :0}
		]
	
	poll.save(function(err){
		if(err){
		console.log(err);
		return;
		} else {
		req.flash('success','Poll created!');
		res.redirect('/');
		}
		});
	}
});

// Load Edit Form

router.get('/edit/:id', ensureAuthenticated, function(req, res){
	Poll.findById(req.params.id, function(err, poll){
	if(err){
	res.write('an error ocurred :(');
	}else{
		
		if(poll.author != req.user._id){
		req.flash('error', 'Not Authorized');
		res.redirect('/');
		}else{
		res.render('edit_poll', {
		title:'Edit Poll',
		poll:poll,
		options:poll.options
		});
		}
	}
	});
});

// Update Submit POST Route

router.post('/edit/:id', function(req, res){
	var query = {_id:req.params.id}
	
	let poll = {};

	poll.title = req.body.title;
	//poll.author = req.user._id;

	poll.options = 
			[{option:req.body.option0,votes :0},
			{option:req.body.option1 ,votes :0},
			{option:req.body.option2 ,votes :0},
			{option:req.body.option3 ,votes :0}
		]
	


Poll.update(query, poll, function(err){
	if(err){
	console.log(err);
	return;
	} else {
	req.flash('success', 'Poll Updated');
	res.redirect('/');
	}
	});
});

//vote a poll
router.post('/vote/:id',function(req,res){
  
  if(req.user !== undefined){
    console.log(req.user._id);
    //user is authenticated and logged in
    let user_query = {_id:req.user._id};
    
    //find out if user has already voted this poll
    User.findById(req.user._id ,function(err,user){
      let result = user.pollsVoted;
      if(err) return err;
    
      if(user.pollsVoted.indexOf(req.params.id)!== -1){
    
        req.flash('error','you already voted this poll!');
        //if user has voted redirect
        res.redirect('/');
      } else{
        
       //else let user vote
     
        votePoll();
       }
       
    })
    
    }else{  
      //user not authenticated
      if (!req.session.views){
      //if user has not voted this poll yet
      votePoll(); //let user vote
      //increment after user has voted      
      req.session.views = 1;

      }else{
      //user has already voted this poll
      req.session.views += 1;
      req.flash('error','you already voted this poll!');
      res.redirect('/');
      }
  } 
  
    function votePoll(){
    if(req.body.answer === undefined){
      Poll.findById(req.params.id, function(err,poll){
        if(err) return err;

        var poll_options = poll.options;
        poll_options = poll_options.filter(function(option){
        return option.option !=='';
        })
        req.flash('info', "You didn't choose an option");
        res.render('poll', {
          poll:poll,
          options:poll_options, 
          errors:["You didn't choose an option"]
        });
		  });
	  }else{
      let choice = Number(req.body.answer);

      let query = {_id:req.params.id ,"options.op":choice};

      let inc_vote = {$inc :{"options.$.votes":1}};
    
      Poll.update(query,inc_vote)
      .exec(function(err,poll){
        if(err){
          return err;
          }else{
           if(req.user !== undefined){
            //user is authenticated and logged in
              let user_query = {_id:req.user._id};
              let push_vote ={ $push:{ "pollsVoted": req.params.id}};
            
              User.update(user_query,push_vote,function(err){
                if(err) return err;
  
                });
              }
    
          req.flash('success', 'Voted!');
          res.redirect('/');
          }	
         });
      }
    }  
});


// Delete Poll
router.delete('/:id', function(req, res){
	if(!req.user._id){
	res.status(500).send();
	}
	var query = {_id:req.params.id}
	Poll.findById(req.params.id, function(err, poll){
	if(poll.author != req.user._id){
	res.status(500).send();
	} else {
	Poll.remove(query, function(err){
	if(err){
	console.log(err);
	}
	res.send('Success');
	});
}
});
});
// Get Single Poll
router.get('/:id', function(req, res){
	Poll.findById(req.params.id, function(err,poll){
	if(err) return err;
	var poll_options = poll.options;
	poll_options = poll_options.filter(function(option){
	return option.option !=='';
	})
	res.render('poll', {
	poll:poll,
	options:poll_options

	});
	});
	});


// Access Control
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
	return next();
	} else {
	req.flash('error', 'Please login');
    res.redirect('/users/login');
   }
}

module.exports = router;
