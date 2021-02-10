var $music = {};

/**
 * data
 */
$music.data = {

	/* 더보기버튼 */
	more : {
		mseq : 0,
		abseq : 0,
		atseq : 0,
	},

	/* 재생목록 */
	playList : {
		/*	status에 들어갈 값
			nothing // 재생목록에 아무것도없는 상태
			on 		// 재생목록에 하나이상의 노래가 있고, 재생중
			off 	// 재생목록에 하나이상의 노래가 있지만, 재생하지않음
		*/
		status : "nothing",

		// 실행중인 곡 번호
		playingNumber : null,
		
		// 재생목록 정보배열
		items : [
			/* example
			{
				mseq : null,	곡 번호
				title : null,	곡 제목
				src : null,		곡 재생경로
				
				abseq : null,	앨범 번호
				abimg : null,	앨범 재킷
				
				atseq : null,	아티스트 번호
				name : null		아티스트 이름
			}*/
		]
	},

	/* input:checkbox조작시 나타나는 팝업 */
	listByCheck : {
		count : 0,
		items : [],
	},

	/* myList에 들어가기전  */
	myList : {
		items : [
			// {
			// 	mseq: null,
			// }
		]
	}

};

/**
 * 
 */
$music.utilMethod = {
	/* 목록중 선택한 음악 DOM으로부터 제이쿼리를 통해 필요한 값들을 객체로 반환 */
	getHiddenData: function(self) {
		return {
			mseq : self.closest("tr").find("input[name=mseq]").val() * 1
			, abseq : self.closest("tr").find("input[name=abseq]").val() * 1
			, atseq : self.closest("tr").find("input[name=atseq]").val() * 1
			, title : self.closest("tr").find("input[name=title]").val()
			, src : self.closest("tr").find("input[name=src]").val()
			, abimg : self.closest("tr").find("input[name=abimg]").val()
			, name : self.closest("tr").find("input[name=name]").val()
		};
	},

	/* 재생목록 비우기 */
	playListClear: function() {
		$music.data.playList.status = "nothing";
		$music.data.playList.playingNumber = null;
		$music.data.playList.items = [];
	},

	/* 로그인되어있으면 진행 안되어있으면 로그인창 */
	loginCheck : function() {
		if ($("body > input[name=useq]").val() === "") {
			if (confirm("로그인이 필요한 서비스입니다.\n로그인 하시겠습니까?")) {
				location.href="/loginForm";
				return false;
			} else {
				return false;
			}
		} else {
			return true;
		}
	},
}

/**
 * 함수
 */
$music.method = {
	/* 듣기, 재생목록, 내리스트, 더보기 같은 아이콘의 hover기능 TODO: 모든 아이콘제어는 이걸로 하게되면 색깔 일괄변경 가능 */
	iconHoverListen : (function() {
		$(function() {
			$(".iconButton").mouseover(function() {
				$(this).find("span").css({
					color:"#3f3fff"
					, opacity: 0.5
				});
			});
	
			$(".iconButton").mouseleave(function() {
				if ($(this).hasClass("unlike")) {
					$(this).find("span").css({
						color:"red"
						, opacity: 1
					});
				} else {
					$(this).find("span").css({
						color:"#333333"
						, opacity: 1
					});
				}
				
			});
		});
	})(),

	/* 더보기 버튼 hover 기능 */
	moreHoverListen : (function() {
		$(function() {
			$("#musicMoreBox .textBox").mouseover(function() {
				var index = $(this).closest("li").index();
				if (index === 5) {

				} else {
					$(this).prev().find("span").css({color: "#3f3fff"});
				}
				
				$(this).next().show();
				// $(this).parent().css({background: "#dedede"});
				// $(this).find("a").css({color: "#cb78ff"});
			});
	
			$("#musicMoreBox .textBox").mouseleave(function() {
				var index = $(this).closest("li").index();
				if (index === 5) {
				} else {
					$(this).prev().find("span").css({color: "#333333"});
				}
				
				$(this).next().hide();
				// $(this).parent().css({background: "#ffffff"});
				// $(this).find("a").css({color: "#333333"});
			});

			$("#musicMoreBox .close").mouseover(function() {
				$(this).find("span").css({color: "#3f3fff"});
			});

			$("#musicMoreBox .close").mouseleave(function() {
				$(this).find("span").css({color: "#333333"});
			});
		});
	})(),

	/* 더보기 관련 on/off함수포함한 객체 리턴 */
	more : (function() {

		function initFlag() {
			$music.data.more.mseq = 0;
			$music.data.more.abseq = 0;
			$music.data.more.atseq = 0;
		};
		
		function applyFlag(mseq, abseq, atseq) {
			$music.data.more.mseq = mseq;
			$music.data.more.abseq = abseq;
			$music.data.more.atseq = atseq;
		};
	
		function initAttr() {
			$("#musicMoreBox .textBox").eq(0).find("a").attr("href", "#");
			$("#musicMoreBox .textBox").eq(1).find("a").attr("href", "#");
			$("#musicMoreBox .textBox").eq(2).find("a").attr("href", "#");
			// $("#musicMoreBox .textBox").eq(3).find("a").attr("href", "#");
			// $("#musicMoreBox .textBox").eq(5).find("a").attr("href", "#");
		};
	
		function applyAttr() {
			$("#musicMoreBox .textBox").eq(0).find("a").attr("href", "musicView?mseq=" + $music.data.more.mseq);
			$("#musicMoreBox .textBox").eq(1).find("a").attr("href", "albumView?abseq=" + $music.data.more.abseq);
			$("#musicMoreBox .textBox").eq(2).find("a").attr("href", "artistView?atseq=" + $music.data.more.atseq);
			$("#musicMoreBox .textBox").eq(3).find("a").attr("onclick", "$music.method.like(null, null, "+$music.data.more.mseq+");");
			$("#musicMoreBox .textBox").eq(4).find("a").attr("onclick", "$music.method.unlike(null, null, "+$music.data.more.mseq+");");
			$("#musicMoreBox .textBox").eq(5).find("a").attr("onclick", "$music.method.ban("+$music.data.more.mseq+");");
		};
	
		var off_musicMoreBox = function() {
			$("#musicMoreBox").hide();
			initFlag(); // 플래그 변수 값 초기화
			initAttr(); // 팝업의 경로 속성 초기화
		};
	
		var on_musicMoreBox = function(self) {
			var music = $music.utilMethod.getHiddenData(self);
			if (self.closest("tr").find("input[name=likeyn]").length > 0) {
				$("#musicMoreBox .textBox").eq(3).closest("li").hide();
				$("#musicMoreBox .textBox").eq(4).closest("li").show();
			} else {
				$("#musicMoreBox .textBox").eq(3).closest("li").show();
				$("#musicMoreBox .textBox").eq(4).closest("li").hide();
			}

			if ($music.data.more.mseq !== music.mseq) { // 최초 한번 클릭시

				// 스크롤 감지
				$(window).on("scroll", function(){
					/* 팝업 띄워놓고 스크롤하고다니면 이상한거같아서... 지우는게 낫다고 판단 */
					off_musicMoreBox();
				});

				var position = self.closest("td").offset();
				var scrollHeight = $(document).scrollTop();
				$("#musicMoreBox").css({
					left: position.left - 129,
					top: position.top + 86 - scrollHeight,
				});

				// hidden으로부터 읽어온 값 중 플래그값에 고유번호들만 저장
				applyFlag(
					music.mseq
					, music.abseq
					, music.atseq
				); 

				// 저장한 고유값으로 팝업 경로에 적용
				applyAttr();
	
				$("#musicMoreBox").show();
	
			} else { // 동일한 행의 더보기를 또 눌렀을 시
				off_musicMoreBox();
			}
		};
	
		return {
			on_musicMoreBox: on_musicMoreBox, // 더보기버튼 on
			off_musicMoreBox: off_musicMoreBox, // 더보기버튼 off
		}
	})(),

	/* 음악목록 중 체크 누르면 나오는 팝업 on/off포함 */
	listByCheck : (function() {
		var off_listByCheck = function() {
			$("#listByCheckBox").hide();

			// 초기화
			$music.data.listByCheck.items = [];
			$music.data.listByCheck.count = 0;
		};
	
		var on_listByCheck = function() {

			var musicInfoList = [];
			$("input:checkbox[name=mseq_checkbox]:checked").each(function(index, el) {
				// tr>td>input:checkbox로 시작해 tr로 올라간다음 input:hidden들의 값을 추출
				var music = $music.utilMethod.getHiddenData($(el));
				musicInfoList.push(music);
			});

			// 갖고온 musicInfoList를 보관
			$music.data.listByCheck.items = musicInfoList;
			$music.data.listByCheck.count = musicInfoList.length;

			// 띄워질 화면에 적용하고 show
			$("#listByCheckBox").find(".count").text($music.data.listByCheck.count);
			$("#listByCheckBox").show();
		};

		var uncheck = function() {
			// 체크되어있는 값 풀리게 다시 클릭
			$("input:checkbox[name=mseq_checkbox]:checked").each(function(index, el) {
				$(el).trigger("click");
			});
		};

		var listen = function() {
			// 재생목록 초기화
			$music.utilMethod.playListClear();

			// 체크되어있는 값의 tr로 접근해 초기화된 재생목록에 담고 첫건 재생
			$("input:checkbox[name=mseq_checkbox]:checked").each(function(index, el) {
				$(el).closest("tr").find(".listen").trigger("click");
			});

			// 전부 체크해제
			uncheck();
		};

		var playList = function() {
			// 체크되어있는 값의 tr로 접근해 초기화된 재생목록에 담기
			$("input:checkbox[name=mseq_checkbox]:checked").each(function(index, el) {
				$(el).closest("tr").find(".playListAdd").trigger("click");
			});

			// 전부 체크해제
			uncheck();
		};

		return {
			on_listByCheck: on_listByCheck 		// on
			, off_listByCheck: off_listByCheck 	// off
			, uncheck : uncheck					// 선택해제
			, listen : listen					// 듣기
			, playList : playList				// 재생목록
		};
	})(),

	/* 재생목록 기능들을 가진 객체 리턴 */
	musicList : (function() {

		// 중복제거 
		function removeDuplicate() {
			$music.data.playList.items = $music.data.playList.items.filter(function(item, index) {
				return (
					$music.data.playList.items.findIndex(function(findItem) {
						return findItem.mseq === item.mseq;
					}) === index
				);
			});
		};

		function alreadyMusic(music) {
			return $music.data.playList.items.findIndex(function(item) {
				return item.mseq === music.mseq;
			}) > -1;
		};

		function getData() {
			return {
				status : $music.data.playList.status,
				playingNumber : $music.data.playList.playingNumber,
				items : $music.data.playList.items,
			};
		};

		function add(music, isFirst) {
			if (isFirst) {
				$music.data.playList.items.unshift(music); // 기존의 목록의 맨앞에 넣기
			} else {
				$music.data.playList.items.push(music); // 기존의 목록의 맨뒤에 넣기
			}
		};

		var stop = function() {
			$music.data.playList.status = "off"; // 상태 off로 변경
			console.log("노래를 중단합니다(미구현)");
		};

		var play = function(mseq) {
			var now = getData().items.findIndex(function(music) {
				return music.mseq === getData().playingNumber; // 재생중인 곡번호가 몇번째 인지 반환
			});

			$music.data.playList.playingNumber = mseq; 	// 진행중 곡 번호 저장
			$music.data.playList.status = "on"; 		// 상태 on으로 변경

			// 전달받은 곡번호로 실행
			console.log(mseq + "번 노래로 실행합니다(미구현) \n[재생목록 중 "+ (now+1) +"번째 노래입니다.]");
		};

		var next = function() {
			var now = getData().items.findIndex(function(music) {
				return music.mseq === getData().playingNumber; // 재생중인 곡번호가 몇번째 인지 반환
			});
			
			// 마지막곡 여부
			var isFinal = now === (getData().items.length - 1);

			// 마지막 곡이었다면
			if (isFinal) {
				play(getData().items[0].mseq); // 첫번째 곡으로 재생실행
			} else {
				play(getData().items[now + 1].mseq); // 현재 재생중인 곡의 다음곡으로 재생실행
			}
		};

		var prev = function() {
			var now = getData().items.findIndex(function(music) {
				return music.mseq === getData().playingNumber; // 재생중인 곡번호가 몇번째 인지 반환
			});
			
			// 처음곡 여부
			var isFirst = now === 0;

			// 첫번째 곡이었다면
			if (isFirst) {
				play(getData().items[items.length - 1].mseq); // 마지막 곡으로 재생실행
			} else {
				play(getData().items[now-1].mseq); // 현재 재생중인 곡의 이전곡으로 재생실행
			}
		};

		// 듣기 - 목록에서(tr)에서 듣기버튼을 누른경우
		var listen = function(self) {
			// 기존의 재생목록과 재생중인지 아닌지 상관없이 추가하고 바로 재생
			var music = $music.utilMethod.getHiddenData(self);

			if (alreadyMusic(music)) {
				console.log("\""+ music.name +"\"의 \"" + music.title + "\"는(은) 이미 존재하는 곡입니다.\n 새로 추가되지않고 바로 재생합니다");
			} else {
				add(music);
			}
			
			play(music.mseq);
		};

		// 한곡 추가 - 목록에서(tr에서) 재생목록담기버튼을 누른경우
		var playListAdd = function(self) {
			// tr로 올라가서 music정보 수집
			var music = $music.utilMethod.getHiddenData(self);
			add(music);
			/*
			if (alreadyMusic(music)) {
				if (confirm("\""+ music.name +"\"의 \"" + music.title + "\"는(은) 이미 존재하는 곡입니다.\n 그래도 추가하시겠습니까?")) {
					add(music);
				} else {
					// do nothing ...
				}
			} else {
				add(music);
			}
			*/
		};
		
		// 전부 추가 - 목록위의 전제듣기 버튼을 누른 경우
		var playListAddAll = function(musicTrList) {
			$music.utilMethod.playListClear(); // 재생목록 비우기

			var musicDataList = [];
			$(musicTrList).each(function(index, item){
				var music = $music.utilMethod.getHiddenData($(item));
				musicDataList.push(music);
			});

			for(var i = 0; i < musicDataList.length; i++) {
				var music = musicDataList[i];
				add(music);
			}

			play(musicDataList[0].mseq);
		};

		return {
			stop : stop
			, play : play
			, next : next
			, prev : prev
			, listen : listen
			, playListAdd : playListAdd
			, playListAddAll : playListAddAll
		};
	})(),

	/* 내 리스트 */
	myList: (function() {
		var on = function(el) {
			if ($music.utilMethod.loginCheck()) {
				// 선택자 있으면 단건, 없으면 여러건
				if (el) {
					var music = $music.utilMethod.getHiddenData(el);
					$music.data.myList.items = [];
					$music.data.myList.items.push(music);
				}

				$("#myListBox").show();
				$("#dim").show();
			}
		};

		var off = function() {
			$("#myListBox").hide();
			$("#dim").hide();
		};

		// 내리스트 띄우는건 동일하나, 체크박스를 통해 생성된 팝업에서 온경우
		var on_listByCheckBox = function() {
			var musicList = [];

			$("input:checkbox[name=mseq_checkbox]:checked").each(function(index, el) {
				var music = $music.utilMethod.getHiddenData($(el));
				musicList.push(music);
			});
			$music.data.myList.items = musicList;
			
			on();
		};

		// 내리스트 띄우는건 동일하나, 앨범상세나 아티스트상세에서 내 리스트에 추가할 경우
		var on_listByDetail = function() {
			var musicTrList = $("#listBox .musicTr");

			var musicList = [];
			$(musicTrList).each(function(index, item){
				var music = $music.utilMethod.getHiddenData($(item));
				musicList.push(music);
			});

			$music.data.myList.items = musicList;
			
			on();
		};

		var addBundleMaster = function(el) {
			var parameter = {
				title: el.closest("form").find("input[name=title]").val()
			};

			if (parameter.title.length === 0) {
				alert("제목을 입력하세요");
				return false;
			} else {
				$.ajax({
					url: 'addBundleMaster',
					type: 'post',
					data: JSON.stringify(parameter),
					contentType: 'application/json',
					dataType: 'json'
				  })
				.done(function(response) {
					// 성공 시 동작
	
					var template = `
						<div class="bundleList">
							<input type="hidden" name="bmseq" value="${response.bmseq}">
							<input type="hidden" name="title" value="${response.title}">
							<ul>
								<li><div><span style="color: white;"><i class="fas fa-music"></i></span></div></li>
								<li><div><ul><li>${response.title}</li><li>0곡</li></ul></div></li>
							</ul>
						</div>
					`;
					$("#myListBoxBundleBox").prepend(template);
				});
				return true;
			}
		};

		var addBundleDetail = function(bundleMaster) {
			var bundleDetailList = [];
			for (var i = 0; i < $music.data.myList.items.length; i++) {
				var bundleDetail = {
					bmseq: bundleMaster.bmseq
					, mseq: $music.data.myList.items[i].mseq
				}
				bundleDetailList.push(bundleDetail);
			}
			$.ajax({
				url: 'addBundleDetail',
				type: 'post',
				data: JSON.stringify(bundleDetailList),
				contentType: 'application/json',
				dataType: 'json'
			  })
			.always(function() {
				location.reload();
			})
		};
		
		return {
			on: on,
			off: off,

			on_listByCheckBox: on_listByCheckBox,
			on_listByDetail: on_listByDetail,
			addBundleMaster: addBundleMaster,
			addBundleDetail: addBundleDetail,
		};
	})(),

	/* 무시하기 */
	ban: function(mseq) {
		if ($music.utilMethod.loginCheck()) {
			console.log('mseq =>', JSON.stringify(mseq, undefined, 2));
			$.ajax({
				url: 'ban',
				type: 'post',
				data: JSON.stringify(mseq),
				contentType: 'application/json',
				dataType: 'json'
			})
			.always(function() {
				location.reload();
			});
		}
	},

	/* 좋아요 */
	like: function(atseq, abseq, mseq) {
		if ($music.utilMethod.loginCheck()) {
			console.log(" atseq : " + atseq);
			console.log(" abseq : " + abseq);
			console.log(" mseq : " + mseq);
			var atseq = atseq && atseq * 1;
			var abseq = abseq && abseq * 1;
			var mseq = mseq && mseq * 1;
			var parameter = {
				atseq : atseq,
				abseq : abseq,
				mseq : mseq,
			};
			$.ajax({
				url: 'like',
				type: 'post',
				data: JSON.stringify(parameter),
				contentType: 'application/json',
				dataType: 'json'
			})
			.always(function() {
				location.reload();
			});
		}
	},

	/* 좋아요 취소 */
	unlike: function(atseq, abseq, mseq) {
		if ($music.utilMethod.loginCheck()) {
			console.log(" atseq : " + atseq);
			console.log(" abseq : " + abseq);
			console.log(" mseq : " + mseq);
			var atseq = atseq && atseq * 1;
			var abseq = abseq && abseq * 1;
			var mseq = mseq && mseq * 1;
			var parameter = {
				atseq : atseq,
				abseq : abseq,
				mseq : mseq,
			};
			$.ajax({
				url: 'unlike',
				type: 'post',
				data: JSON.stringify(parameter),
				contentType: 'application/json',
				dataType: 'json'
			})
			.always(function() {
				location.reload();
			});
		}
	},

	albumViewPlayButton: function() {
		// 앨범상세에서 앨범재킷안에 play버튼을 눌렀을 때
		// 모든 앨범수록곡을 playList에 추가

		// 재생목록 초기화
		$music.utilMethod.playListClear();

		// 앨범수록곡의 모든 tr에 접근해 초기화된 재생목록에 담고 첫건 재생
		$("#listBox .musicTr").each(function(index, el) {
			$(el).closest("tr").find(".listen").trigger("click");
		});

		// 전부 체크해제
		uncheck();
	},
};

/**
 * event
 */

$(function() {

	// 음악관련 어느곳에서 동일사용 (단, html구조와 music.js를 import해주어야 동작.)
	(function all() {

	/* <a class="allListen iconButton" id="playListAddAll" style="cursor: pointer;"> */
		// 전체듣기	
		$("#playListAddAll").on("click", function() {
			var musicTrList = $("#listBox .musicTr");
			$music.method.musicList.playListAddAll(musicTrList);
		});
	/* <a class="allListen iconButton" id="playListAddAll" style="cursor: pointer;"> */

	/* <table id="listBox"> */

		// 내 리스트 추가
		$("#listBox .myListAdd").on("click", function() {
			$music.method.myList.on($(this));
		});

		// 재생목록에 추가
		$("#listBox .playListAdd").on("click", function() {
			$music.method.musicList.playListAdd($(this));
		});

		// 듣기 기능 연동시작점
		$("#listBox .listen").on("click", function() {
			$music.method.musicList.listen($(this));
		});

		// 더보기 기능 연동시작점
		$("#listBox .moreDiv").on("click", function() {
			$music.method.more.on_musicMoreBox($(this));
		});

		// 체크박스(일괄처리) 클릭시
		$("input:checkbox[name=allCheck]").on("click", function() {
			// allCheck의 체크여부에 따라 모든 체크박스 on/off
			var isAllCheck = $(this).is(":checked");
			$("input:checkbox[name=mseq_checkbox]").each(function() {
				this.checked = isAllCheck;
			});

			if ($("input:checkbox[name=mseq_checkbox]:checked").length > 0) { // 한개라도 선택된게 남아있다면
				$music.method.listByCheck.on_listByCheck();
			} else {
				$music.method.listByCheck.off_listByCheck();
			}
		});

		// 체크박스(단일처리) 클릭시
		$("input:checkbox[name=mseq_checkbox]").on("click", function() {
			var justTotalCount = $("input:checkbox[name=mseq_checkbox]").length;       // 전체개수
			var checkedCount = $("input:checkbox[name=mseq_checkbox]:checked").length; // 선택개수

			$("input[name=allCheck]:checkbox").prop("checked", (justTotalCount === checkedCount)); // 일괄처리버튼 적용

			if ($("input:checkbox[name=mseq_checkbox]:checked").length > 0) { // 한개라도 선택된게 남아있다면
				$music.method.listByCheck.on_listByCheck();
			} else {
				$music.method.listByCheck.off_listByCheck();
			}
		});
	/* <table id="listBox"> */

	/* <div id="listByCheckBox" style="display:none;"> */
		// listByCheckBox의 버튼 이벤트 1. 선택해제
		$("#listByCheckBox .uncheck").on("click", function() {
			$music.method.listByCheck.uncheck();
		});

		// listByCheckBox의 버튼 이벤트 2. 듣기
		$("#listByCheckBox .listen").on("click", function() {
			$music.method.listByCheck.listen();
		});

		// listByCheckBox의 버튼 이벤트 3. 재생목록담기
		$("#listByCheckBox .playList").on("click", function() {
			$music.method.listByCheck.playList();
		});

		// listByCheckBox의 버튼 이벤트 4. 내 리스트
		$("#listByCheckBox .myList").on("click", function() {
			$music.method.myList.on_listByCheckBox();
			$music.method.listByCheck.off_listByCheck();
		});
	/* <div id="listByCheckBox" style="display:none;"> */

	/* <div id="myListBox" style="display:none;"> */
	$(document).on("click", ".bundleList", function() {
		var bundleMaster = {
			bmseq : $(this).find("input[name=bmseq]").val()
			, title : $(this).find("input[name=title]").val()
		};

		$music.method.myList.addBundleDetail(bundleMaster);
	});

	$("form[name=addBundleMaster]").on("click", "input[type=button]", function() {
		if ($music.method.myList.addBundleMaster($(this))) {
			$(this).closest('.form').hide();
			$(this).closest('.form').prev().show();
		}
	});

	$("form[name=addBundleMaster]").on("click", "input[type=reset]", function() {
		$(this).closest('.form').hide();
		$(this).closest('.form').prev().show();
	});

	/* <div id="myListBox" style="display:none;"> */

	/* albumView, artistView */

	if ($("#music_artistView").length > 0) {
		if ($("input[name=artistlikeyn]").length > 0) {
			$(".artist .info .like").remove();
		} else {
			$(".artist .info .unlike").remove();
		}

		$("#music_artistView .albumItem").each(function(index, el) {
			if ($(el).find("input[name=albumlikeyn]").length > 0) {
				$(el).find(".album .info .like").remove();
			} else {
				$(el).find(".album .info .unlike").remove();
			}
		});
	}

	$("#infoAndTrack li").on("click", function() {
		$(this).siblings().removeClass("selectTab");
		$(this).addClass("selectTab");

		var index = $(this).index();
		if (index === 0) {
			$("#infoBox").show();
			$("#trackBox").hide();
		} else {
			$("#infoBox").hide()
			$("#trackBox").show();
		}

		$("body").scrollTop(0);
	});

	$("#trackAndAlbum li").on("click", function() {
		$(this).siblings().removeClass("selectTab");
		$(this).addClass("selectTab");

		var index = $(this).index();
		if (index === 0) {
			$("#trackBox").show();
			$("#albumBox").hide();
		} else {
			$("#listByCheckBox").hide(); // 탭이동해도 남아있는 경우 있음.
			$("#trackBox").hide()
			$("#albumBox").show();
		}

		$("body").scrollTop(0);
	});

	/* albumView, artistView */

	})();
	
});