package com.eco.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.eco.dto.Album;
import com.eco.dto.Bundle;
import com.eco.dto.Chart;
import com.eco.dto.Genre;
import com.eco.dto.MemberVO;
import com.eco.dto.Music;
import com.eco.service.BundleService;
import com.eco.service.MusicService;

@Controller
public class MusicController {
	
	
	@Autowired
	MusicService ms;
	
	@Autowired
	BundleService bundleService;

	@RequestMapping(value = "/browse", method = RequestMethod.GET)
	public String browse(Model model, HttpServletRequest request
			, @RequestParam(value = "selectedType", required = false, defaultValue = "chart") String selectedType
			, @RequestParam(value = "selectedSeq", required = false, defaultValue = "1") int selectedSeq
	) {
		
		MemberVO loginUser = (MemberVO) request.getSession().getAttribute("loginUser");
		
		if (loginUser != null) {
			// bundle
			List<Bundle> bundleList = bundleService.listBundle(loginUser.getUseq());
			for (Bundle b : bundleList) {
				List<Music> musicList = ms.musicListByBundle(b.getBmseq());
				b.setMusicList(musicList);
			}
			model.addAttribute("bundleList", bundleList);
		}
		
		model.addAttribute("selectedType", selectedType);
		model.addAttribute("selectedSeq", selectedSeq);

		
		/** 차트 리스트 */
		List<Chart> chartList = ms.chartList();
		model.addAttribute("chartList", chartList);
		
		/** 장르 리스트 */
		List<Genre> genreList = ms.genreList();
		model.addAttribute("genreList", genreList);

		// 뮤직차트
		// 1. 선택한 타입과 선택한 시퀀스값 추출
			// @RequestParam(value = "selectedSeq", required = false, defaultValue = "1") int selectedSeq -> 선택안할경우 1
			// @RequestParam(value = "selectedType", required = false, defaultValue = "chart") String selectedType -> 선택안할경우 차트
			// 미선택시 차트의 1번으로 진행

		// 2. 선택한 타입과 선택한 시퀀스값으로 music_view 조회
		List<Music> musicList = null;
		if ("chart".equals(selectedType)) {
			musicList = ms.musicListByChart(selectedSeq);
		} else if ("genre".equals(selectedType)){
			musicList = ms.musicListByGenre(selectedSeq);
		}
		model.addAttribute("musicList", musicList);

		return "music/browse";
	}
	
	@RequestMapping(value = "/artistView", method = RequestMethod.GET)
	public String artistView(Model model, HttpServletRequest request) {
		return "music/artistView";
	}

	@RequestMapping(value = "/albumView", method = RequestMethod.GET)
	public String albumView(Model model, HttpServletRequest request
			, @RequestParam("abseq") int abseq) {
		String returnPath = "redirect:/" + request.getHeader("Referer");
		System.out.println("System.out.println(returnPath);");
		System.out.println(returnPath);
		
		Album album = ms.getAlbum(abseq);
		model.addAttribute("album", album);
		
		List<Music> musicListByAlbum = ms.musicListByAlbum(abseq);
		model.addAttribute("musicList", musicListByAlbum);
		
		return "music/albumView";
	}
	
	@RequestMapping(value = "/musicView", method = RequestMethod.GET)
	public String musicView(Model model, HttpServletRequest request) {
		return "music/musicView";
	}
	
	@RequestMapping(value = "/like", method = RequestMethod.POST)
	public String like(Model model, HttpServletRequest request
			, @RequestParam(value = "atseq", required = false, defaultValue = "0") int atseq
			, @RequestParam(value = "abseq", required = false, defaultValue = "0") int abseq
			, @RequestParam(value = "mseq", required = false, defaultValue = "0") int mseq
		) {
		// 세션에서 유저값
		MemberVO loginUser = (MemberVO) request.getSession().getAttribute("loginUser");
		String returnPath = "redirect:/" + request.getHeader("Referer");
		
		if (loginUser == null) {
			returnPath = "/loginForm";
		} else {
			// 넘어온 값에 따라 like에 insert 다만, mseq일경우 ban에서 제거하고 insert
			if (atseq != 0) {
				ms.likeArtist(loginUser.getUseq(), mseq);
			} else if (abseq != 0) {
				ms.likeAlbum(loginUser.getUseq(), mseq);
			} else if (mseq != 0) {
				ms.likeMusic(loginUser.getUseq(), mseq);
			}
			// 되돌아갈 주소는 넘겨받아서 처리
			returnPath = request.getParameter("returnPath");
		}
		
		return returnPath;
	}
	
	@RequestMapping(value = "/unlike", method = RequestMethod.POST)
	public String unlike(Model model, HttpServletRequest request
			, @RequestParam(value = "atseq", required = false, defaultValue = "0") int atseq
			, @RequestParam(value = "abseq", required = false, defaultValue = "0") int abseq
			, @RequestParam(value = "mseq", required = false, defaultValue = "0") int mseq
			) {
		// 세션에서 유저값
		MemberVO loginUser = (MemberVO) request.getSession().getAttribute("loginUser");
		String returnPath = "redirect:/" + request.getHeader("Referer");
		
		if (loginUser == null) {
			returnPath = "/loginForm";
		} else {
			// 넘어온 값에 따라 like에 insert 다만, mseq일경우 ban에서 제거하고 insert
			if (atseq != 0) {
				ms.unlikeArtist(loginUser.getUseq(), mseq);
			} else if (abseq != 0) {
				ms.unlikeAlbum(loginUser.getUseq(), mseq);
			} else if (mseq != 0) {
				ms.unlikeMusic(loginUser.getUseq(), mseq);
			}
			// 되돌아갈 주소는 넘겨받아서 처리
			returnPath = request.getParameter("returnPath");
		}
		
		return returnPath;
	}
	
	@RequestMapping(value = "/ban", method = RequestMethod.POST)
	public String ban(Model model, HttpServletRequest request
			, @RequestParam(value = "mseq", required = false, defaultValue = "0") int mseq
			) {
		// 세션에서 유저값
		MemberVO loginUser = (MemberVO) request.getSession().getAttribute("loginUser");
		String returnPath = "redirect:/" + request.getHeader("Referer");
		
		if (loginUser == null) {
			returnPath = "/loginForm";
		} else {
			ms.banMusic(loginUser.getUseq(), mseq);
			
			// 되돌아갈 주소는 넘겨받아서 처리
			returnPath = request.getParameter("returnPath");
		}
		
		return returnPath;
	}
}
