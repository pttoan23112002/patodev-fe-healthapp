import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

class About extends Component {

    render() {

        return (
            <div className='section-share section-about'>
                <div className='section-about-header'>
                    Truyền thông nói về chuyển đổi số y tế
                </div>
                <div className='section-about-content'>
                    <div className='content-left'>
                        <iframe style={{ 'borderRadius': '25px' }} width="100%" height="385"
                            src="https://www.youtube.com/embed/yykqNOSlgys?si=yAsynJyJcAUggo6C"
                            title="YouTube video player" frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; 
                            picture-in-picture; web-share;"
                            allowFullScreen></iframe>
                    </div>
                    <div className='content-right'>
                        GS.TS Trần Văn Thuấn - Thứ trưởng Bộ Y tế cho biết, ứng dụng công nghệ thông tin
                        và chuyển đổi số y tế đóng góp không nhỏ trong việc kiểm soát tốt dịch bệnh cũng
                        như phát triển các hoạt động kinh tế - xã hội.
                        <br />
                        <br />
                        Ngày 2/12, tại TP Vinh (Nghệ An) đã diễn ra Hội nghị chuyển đổi số Y tế khu vực
                        phía Bắc. Phát biểu khai mạc hội nghị, GS.TS Trần Văn Thuấn - Thứ trưởng Bộ Y tế
                        cho biết, ứng dụng công nghệ thông tin và chuyển đổi số y tế đóng góp không nhỏ
                        trong việc kiểm soát tốt dịch bệnh cũng như phát triển các hoạt động kinh tế - xã
                        hội.
                        <br />
                        <br />
                        Chính vì vậy, Bộ Y tế, Bộ Thông tin và Truyền thông, Bộ Công an và các doanh
                        nghiệp công nghệ thông tin đã phối hợp triển khai rất hiệu quả nhiều ứng dụng
                        công nghệ thông tin phục vụ cho công tác phòng, chống dịch bệnh COVID-19 như:
                        Các ứng dụng quản lý khai báo y tế, xét nghiệm, quản lý ca bệnh, quản lý điều
                        trị bệnh nhân COVID-19, quản lý oxy y tế…;
                        <br />
                        <span style={{ 'float': 'right' }}>Nguồn "<a target='_blank' href='https://moh.gov.vn/hoat-dong-cua-lanh-dao-bo/-/asset_publisher/TW6LTp1ZtwaN/content/chuyen-oi-so-y-te-can-thiet-cho-nguoi-dan-trong-cham-soc-suc-khoe' style={{ 'textDecoration': 'none' }}>Bộ y tế</a>"
                        </span>
                    </div>
                </div>
            </div>
        );
    };
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
