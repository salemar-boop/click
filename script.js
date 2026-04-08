$(function () {
  $(".orb").hover(
    function () {
      $(this).stop(true).animate({ opacity: 0.7 }, 220).css("transform", "scale(1.12)");
    },
    function () {
      $(this).stop(true).animate({ opacity: 1 }, 260).css("transform", "scale(1)");
    }
  );

  if ($("body").hasClass("page1")) {
    $("#pulse").on("click", function () {
      $(".page1 .orb")
        .animate({ width: "+=18", height: "+=18" }, 260)
        .animate({ width: "-=18", height: "-=18" }, 260);
    });

    $("#toggle-contrast").on("click", function () {
      $("body").toggleClass("high-contrast");
    });

    $(window).on("scroll", function () {
      if ($(window).scrollTop() > 40 && $(".page1 .trail").length < 5) {
        $("#space1").append('<span class="trail" style="left:4%; top:6%;">echo</span>');
      }
    });
  }

  if ($("body").hasClass("page2")) {
    $("#shrink").on("click", function () {
      $(".page2 .orb").last().fadeOut(420);
    });

    $("#restore").on("click", function () {
      $(".page2 .orb").fadeIn(420);
    });

    $(".page2 .orb").on("click", function () {
      $(this).animate({ width: "+=24", height: "+=24" }, 280);
      $(this).css("border", "2px solid rgba(255,255,255,0.65)");
    });

    $(window).on("scroll", function () {
      const depth = Math.min($(window).scrollTop() / 420, 1);
      $("body").css("background-color", "rgba(0,0,0," + depth.toFixed(2) + ")");
    });
  }

  if ($("body").hasClass("page3")) {
    $("#scatter").on("click", function () {
      $(".page3 .orb").each(function () {
        const left = Math.floor(Math.random() * 78) + "%";
        const top = Math.floor(Math.random() * 58) + "%";
        $(this).animate({ left: left, top: top }, 420);
      });
    });

    $("#align").on("click", function () {
      $(".page3 .orb").each(function (i) {
        $(this).animate({ left: 8 + i * 20 + "%", top: "35%" }, 420);
      });
    });

    $(".page3 .orb").hover(
      function () {
        $(this).before('<span class="trail temp" style="left:2%; top:2%;">light</span>');
      },
      function () {
        $(".page3 .temp").fadeOut(250, function () {
          $(this).remove();
        });
      }
    );

    $(window).on("scroll", function () {
      if ($(window).scrollTop() > 65) {
        $("body").addClass("glow-mode");
      } else {
        $("body").removeClass("glow-mode");
      }
    });
  }

  if ($("body").hasClass("page4")) {
    $("#echo").on("click", function () {
      $("#space4").append('<div class="orb echo" style="left:45%; top:35%; width:60px; height:60px; background:#c7f9cc;"></div>');
      $(".echo").last().animate({ width: "160px", height: "160px", opacity: 0.35 }, 500);
    });

    $("#vanish").on("click", function () {
      const items = $(".page4 .orb:visible");
      if (!items.length) {
        return;
      }
      const pick = Math.floor(Math.random() * items.length);
      items.eq(pick).fadeOut(350);
    });

    $(".page4 .orb").on("click", function () {
      $(this).toggleClass("high-contrast");
      $(this).animate({ left: "+=12" }, 200).animate({ left: "-=12" }, 200);
    });

    $(window).on("scroll", function () {
      if ($(window).scrollTop() > 60 && !$("#space4 .scroll-note").length) {
        $("#space4").before('<p class="subtitle scroll-note center-wrap">The canvas is listening to movement.</p>');
      }
    });
  }
});
