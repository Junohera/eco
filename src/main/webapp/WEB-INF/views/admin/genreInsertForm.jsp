<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<script type="text/javascript">
function go_save(){
	document.frm.action = "genreInsert";
	document.frm.submit();
}
function go_mov(){
	location.href = "GenreManage";
}
</script>
<article>
<h1>장르등록</h1>
<form name="frm" method="post" enctype="multipart/form-data">
<table>
	<tr><th>장르이름</th><td width="343" colspan="5">
		<input type="text" name="title" size="47" maxlength="100" value="${dto.title}"></td></tr>
	<tr><th>장르이미지</th>
		<td width="343" colspan="5"><input type="file" name="filename"></td></tr>
		${message }
</table>
<input class="btn" type="button" value="등록" onClick="go_save()">
<input class="btn" type="button" value="목록" onClick="go_mov()">
</form>
</article>