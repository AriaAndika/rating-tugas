CREATE TABLE rating(
	urutan INT AUTO_INCREMENT,
	nama VARCHAR(20),
	rating INT,
	komentar VARCHAR(500),
	PRIMARY KEY (urutan)
);



--@block
SELECT * FROM rating;

--@block
SELECT rating FROM rating