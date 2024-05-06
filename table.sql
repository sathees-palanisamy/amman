CREATE TABLE orderDb.
(
orderid    SMALLINT(6) NOT NULL DEFAULT 0,    
name       VARCHAR(150) NOT NULL  DEFAULT '',      
phone       VARCHAR(30) NOT NULL  DEFAULT '',  
gst       VARCHAR(30) NOT NULL  DEFAULT '',  
code       VARCHAR(10) NOT NULL  DEFAULT '',    
address       VARCHAR(500) NOT NULL  DEFAULT '',    
particular1       VARCHAR(50) NOT NULL  DEFAULT '',        
book1       VARCHAR(30) NOT NULL  DEFAULT '',    
rate1       VARCHAR(30) NOT NULL  DEFAULT '',   
particular2       VARCHAR(50) NOT NULL  DEFAULT '',        
book2       VARCHAR(30) NOT NULL  DEFAULT '',    
rate2       VARCHAR(30) NOT NULL  DEFAULT '',  
particular3       VARCHAR(50) NOT NULL  DEFAULT '',        
book3       VARCHAR(30) NOT NULL  DEFAULT '',    
rate3       VARCHAR(30) NOT NULL  DEFAULT '', 
particular4       VARCHAR(50) NOT NULL  DEFAULT '',        
book4       VARCHAR(30) NOT NULL  DEFAULT '',    
rate4       VARCHAR(30) NOT NULL  DEFAULT '', 
particular5       VARCHAR(50) NOT NULL  DEFAULT '',        
book5       VARCHAR(30) NOT NULL  DEFAULT '',    
rate5       VARCHAR(30) NOT NULL  DEFAULT '', 
particular6       VARCHAR(50) NOT NULL  DEFAULT '',        
book6       VARCHAR(30) NOT NULL  DEFAULT '',    
rate6       VARCHAR(30) NOT NULL  DEFAULT '', 
particular7       VARCHAR(50) NOT NULL  DEFAULT '',        
book7       VARCHAR(30) NOT NULL  DEFAULT '',    
rate7       VARCHAR(30) NOT NULL  DEFAULT '',
particular8       VARCHAR(50) NOT NULL  DEFAULT '',        
book8       VARCHAR(30) NOT NULL  DEFAULT '',    
rate8       VARCHAR(30) NOT NULL  DEFAULT '',
particular9       VARCHAR(50) NOT NULL  DEFAULT '',        
book9       VARCHAR(30) NOT NULL  DEFAULT '',    
rate9       VARCHAR(30) NOT NULL  DEFAULT '',
count       VARCHAR(150) NOT NULL  DEFAULT '',    
noOfCopies       VARCHAR(150) NOT NULL  DEFAULT '',    
totalamt       VARCHAR(150) NOT NULL  DEFAULT '',    
pendingamt       VARCHAR(150) NOT NULL  DEFAULT '',    
paid VARCHAR(30) NOT NULL DEFAULT '',       
paymentId VARCHAR(30) NOT NULL DEFAULT '', 
paymentStatus VARCHAR(30) NOT NULL DEFAULT '',
paymentRef VARCHAR(900) NOT NULL DEFAULT '',
lastUpdateTimestamp VARCHAR(30) NOT NULL DEFAULT '', 
orderDate VARCHAR(30) NOT NULL DEFAULT '', 
PRIMARY KEY     (orderid)                       
);


CREATE TABLE loginDb
(
 Mail        VARCHAR(150) NOT NULL  DEFAULT '',
pwd       VARCHAR(150) NOT NULL  DEFAULT '',
PRIMARY KEY     (Mail)       
);

INSERT INTO loginDb (Mail,pwd) VALUES ('amman','print');