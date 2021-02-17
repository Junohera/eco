package com.eco.admin.valid;

import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import com.eco.dto.GenreVO;

public class ContentValidator1 implements Validator{

	@Override
	public boolean supports(Class<?> clazz) {
		return false;
	}

	@Override
	public void validate(Object target, Errors errors) {
		GenreVO dto = (GenreVO)target;
		
		if(dto.getTitle()==null || dto.getTitle().trim().isEmpty())
			errors.rejectValue("title", "제목을 입력하세요");
		
	}

}
