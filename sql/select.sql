select * from music_view order by mseq desc;


select 
    m.mseq
    , m.title
    , m.content
    , m.gseq
    , m.titleyn
    , m.theme
    , ab.abseq
    , ab.title as abtitle
    , ab.img as abimg
    , ab.content as abcontent
    , ab.pdate as pdate
    , at.atseq
    , at.name
    , at.groupyn
    , at.gender
    , at.gseq as atgseq
    , at.img as atimg
    , at.description as genre
from music m
    left join album ab
    on m.abseq = ab.abseq
    left join artist at
    on at.atseq = m.atseq and at.atseq = ab.atseq;


select * from music_view;

select * from album_view;

select * from bundle_master;

select * from music_view where theme like '%'||3||'%'
		order by mseq desc;



select * from BUNDLE_MASTER;
select * from BUNDLE_DETAIL;

select * from music_ban;


select * from music;

select * from album;

update album set img = 'https://cdn.music-flo.com/image/v2/album/125/777/05/04/405777125_6010e16c_o.jpg?1611719022486/dims/resize/500x500/quality/90';